import 'reflect-metadata';
import { appsRepository } from '../reduxApp';
import { dataDescriptor, log } from '../utils';

export class ConnectOptions {
    public app?= 'default';
    public id?: any;
    public live?= false;
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
            const reflectErrMsg = `[connect] Failed to reflect type of property '${propertyKey}'. ` +
                `Make sure you're using typescript (you really should if you don't already...) and that the ` +
                `'emitDecoratorMetadata' compiler option in your tsconfig.json file is turned on. ` +
                `Note that even if typescript is configured correctly it may fail to reflect ` +
                `property types due to the loading order of your classes.`;
            throw new Error(reflectErrMsg);
        }

        // initial value
        var value = target[propertyKey];

        // delete old descriptor
        const oldDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        if (oldDescriptor) {
            delete target[propertyKey];
        }

        // and replace it with a new descriptor        
        Object.defineProperty(target, propertyKey, {
            get: () => {

                // no app to connect
                const app = appsRepository[options.app];
                if (!app) {
                    log.debug(`[connect] Application '${options.app}' does not exist. Property ${propertyKey} is not connected.`);
                    if (oldDescriptor && oldDescriptor.get) {
                        return oldDescriptor.get();
                    } else {
                        return value;
                    }
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
                    setTimeout(() => {

                        // avoid race conditions
                        if (!(propertyKey in Object.keys(target)))
                            return;

                        // replace descriptor
                        delete target[propertyKey];
                        Object.defineProperty(target, propertyKey, dataDescriptor);
                        value = target[propertyKey] = result;
                        log.debug(`[connect] Property '${propertyKey}' connected.`);
                    });
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

                // set value
                if (oldDescriptor && oldDescriptor.set) {
                    return oldDescriptor.set(newValue);
                } else if (!oldDescriptor || oldDescriptor && oldDescriptor.writable) {
                    return value = newValue;
                }
            }
        });
    };
}