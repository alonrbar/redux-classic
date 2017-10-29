import 'reflect-metadata';
import { appsRepository, DEFAULT_APP_NAME } from '../reduxApp';
import { accessorDescriptor, dataDescriptor, deferredDefineProperty, log } from '../utils';

export class ConnectOptions {
    /**
     * The name of the ReduxApp instance to connect to. 
     * Default value is the default app name.
     */
    public app?= DEFAULT_APP_NAME;
    /**
     * The ID of the target component. Assuming the ID was assigned to the
     * component by the 'withId' decorator.
     */
    public id?: any;
    /**
     * The 'connect' decorator uses a getter to connect to the it's target. By
     * default the the getter is replaced with a standard value once the first
     * non-empty value is retrieved. Set this value to false to leave the getter
     * in place.
     */
    public live?= false;
}

/**
 * Property decorator. 
 * 
 * Connects the property to a component in the specified (or default) app.
 * 
 * Usage Note: 
 * 
 * Connected properties can be described as pointers to other components. If the
 * connected property has an initial value assigned, it will be overridden once
 * the the component is connected. One consequence of this fact is that there
 * must be at least one source component, i.e. there must be at least one
 * component of that type that has a value and is not decorated with the
 * 'connect' decorator.
 */
export function connect(options?: ConnectOptions): PropertyDecorator {

    return (target: any, propertyKey: string | symbol) => {

        // initial value
        var value = target[propertyKey];

        // remember old descriptor
        const oldDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey);

        // and replace it with a new descriptor
        const newDescriptor = {
            get: () => {

                const app = appsRepository[options.app];
                if (!app) {
                    log.debug(`[connect] Application '${options.app}' does not exist. Property ${propertyKey} is not connected.`);
                    if (oldDescriptor && oldDescriptor.get) {
                        return oldDescriptor.get();
                    } else {
                        return value;
                    }
                }

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

                // get the component to connect
                const warehouse = app.getTypeWarehouse(type);
                var result: any;
                if (options.id) {

                    // get by id
                    result = warehouse.get(options.id);
                } else {

                    // get the first value
                    result = warehouse.values().next().value;
                }

                // once connected, replace getter with regular data descriptor
                // (so that view frameworks such as Aurelia and Angular won't
                // need to use dirty-checking)
                if (result && !options.live) {

                    delete target[propertyKey];
                    Object.defineProperty(target, propertyKey, dataDescriptor);
                    value = target[propertyKey] = result;
                    log.debug(`[connect] Property '${propertyKey}' connected.`);
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
    };
}