import { appsRepository } from '../reduxApp';
import { log } from '../utils';
import { withId } from './withId';
import 'reflect-metadata';

export class ConnectOptions {
    public app?= 'default';
    public id?: any;
}

/**
 * Property decorator.
 * Connects the component to the specified (or default) app.
 */
export function connect(options?: ConnectOptions): PropertyDecorator {

    options = Object.assign(new ConnectOptions(), options);

    return (target: any, propertyKey: string | symbol): void => {

        // get the property type (see 'metadata' section of https://www.typescriptlang.org/docs/handbook/decorators.html)
        const type = Reflect.getMetadata("design:type", target, propertyKey);
        if (!type) {
            const reflectErrMsg = `[connect] Failed to reflect type of property '${propertyKey}'. Either you're not using typescript ` +
                `(and you really should...) or you forget to turn on the 'emitDecoratorMetadata' ` +
                `compiler option in your tsconfig.json file.`;
            throw new Error(reflectErrMsg);
        }

        // initial value
        var value = target[propertyKey];

        // delete old descriptor
        var oldGetter: () => any;
        var oldSetter: any;
        const oldDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        if (oldDescriptor) {
            oldGetter = oldDescriptor.get;
            oldSetter = oldDescriptor.set;
            delete target[propertyKey];
        }

        // and replace it with a new descriptor        
        Object.defineProperty(target, propertyKey, {
            get: () => {

                // uninitialized app
                const app = appsRepository[options.app];
                if (!app) {
                    log.debug(`[connect] Application '${options.app}' does not exist. Property ${propertyKey} is not connected.`);
                    if (oldGetter) {
                        return oldGetter();
                    } else {
                        return value;
                    }
                }

                const warehouse = app.getTypeWarehouse(type);
                if (options.id) {

                    // assign the id
                    withId(options.id)(target, propertyKey);

                    // return
                    return warehouse.get(options.id);
                } else {

                    // get the first value
                    return warehouse.values().next().value;
                }
            },
            set: (newValue: any) => {

                // uninitialized app
                const app = appsRepository[options.app];
                if (app)
                    throw new Error("Can not set connected components directly after they've been connected. Set the their source object instead.");

                if (oldSetter) {
                    return oldSetter(newValue);
                } else if (!oldDescriptor || oldDescriptor && oldDescriptor.writable) {
                    return value = newValue;
                }
            }
        });
    };
}