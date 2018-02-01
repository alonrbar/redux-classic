import 'reflect-metadata';
import { ClassInfo } from '../../info';
import { appsRepository, ReduxApp } from '../../reduxApp';
import { accessorDescriptor, dataDescriptor, deferredDefineProperty, log } from '../../utils';
import { ConnectOptions } from './connectOptions';

/**
 * Property decorator. 
 * 
 * Connects the property to a component in the specified (or default) app.
 * 
 * Usage Note: 
 * 
 * Connected properties can be thought of as pointers to other components. If
 * the connected property has an initial value assigned, it will be overridden
 * once the component is connected. One consequence of this fact is that there
 * must be at least one source component, i.e. there must be at least one
 * component of that type that has a value and is not decorated with the
 * 'connect' decorator.
 */
export function connect(options?: ConnectOptions): PropertyDecorator;
export function connect(target: any, propertyKey: string | symbol): void;
export function connect(targetOrOptions?: any, propertyKeyOrNothing?: string | symbol): any {
    if (propertyKeyOrNothing) {
        connectDecorator.call(undefined, targetOrOptions, propertyKeyOrNothing);
    } else {
        return (target: any, propertyKey: string | symbol) => connectDecorator(target, propertyKey, targetOrOptions);
    }
}

function connectDecorator(target: any, propertyKey: string | symbol, options?: ConnectOptions) {

    options = Object.assign(new ConnectOptions(), options);

    // initial value
    var value = target[propertyKey];

    // mark as connected
    //
    // notes:
    // 1. we mark to (among others) avoid duplicate storage in the store.
    // 2. we don't use CreatorInfo here since it is what defines component
    //    creators and standard classes may also use the connect decorator.
    const info = ClassInfo.getOrInitInfo(target);
    info.connectedProps[propertyKey] = true;

    // get the property type 
    // (see 'metadata' section of https://www.typescriptlang.org/docs/handbook/decorators.html)
    const type = Reflect.getMetadata("design:type", target, propertyKey);
    if (!type) {
        const reflectErrMsg = `[connect] Failed to reflect type of property '${propertyKey}'. ` +
            `Make sure you're using TypeScript and that the 'emitDecoratorMetadata' compiler ` +
            `option in your tsconfig.json file is turned on. ` +
            `Note that even if TypeScript is configured correctly it may fail to reflect ` +
            `property types due to the loading order of your classes. ` +
            `In that case, make sure that the type of '${propertyKey}' is loaded prior to the ` +
            `type of it's containing class (${target.constructor.name}).`;
        throw new Error(reflectErrMsg);
    }

    // remember old descriptor
    const oldDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey);

    // and replace it with a new descriptor
    const newDescriptor = {
        get: function (this: any) {

            const result = ReduxApp.getComponent(type, options.id, options.app);

            // once connected, replace getter with regular data descriptor
            // (so that view frameworks such as Aurelia and Angular won't
            // need to use dirty-checking)
            if (result && !options.live) {

                Object.defineProperty(this, propertyKey, dataDescriptor);
                value = this[propertyKey] = result;
                log.verbose(`[connect] Property '${propertyKey}' connected. Type: ${type.name}.`);
            }

            return result;
        },
        set: (newValue: any) => {

            // disconnection warning
            const app = appsRepository[options.app];
            if (app) {

                // will only get here if 'live' option is on
                log.warn(`[connect] Connected component '${propertyKey}' value assigned. Component disconnected.`);
            }

            // Set value.
            // If called after connection it will disconnect the property.
            // If called before connection will behave as the original property did.
            if (oldDescriptor && oldDescriptor.set) {
                return oldDescriptor.set(newValue);
            } else if (!oldDescriptor || oldDescriptor && oldDescriptor.writable) {
                return value = newValue;
            }
        }
    };

    return deferredDefineProperty(target, propertyKey, Object.assign({}, accessorDescriptor, newDescriptor));
}