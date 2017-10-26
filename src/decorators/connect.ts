import { appsRepository } from '../reduxApp';
import { log } from '../utils';
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
            const reflectErrMsg = `[connect] Failed to reflect type of property '${propertyKey}'. ` +
                `Make sure you're using typescript (you really should if you don't already...) and that the ` + 
                `'emitDecoratorMetadata' compiler option in your tsconfig.json file is turned on. ` + 
                `Note that even if typescript is configured correctly it may fail to reflect ` +
                `property types due to the loading order of your classes.` ;
            throw new Error(reflectErrMsg);
        }

        // initial value
        var value = target[propertyKey];

        // delete old descriptor
        var oldGetter: () => any;
        const oldDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
        if (oldDescriptor) {
            oldGetter = oldDescriptor.get;
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

                    // return by id
                    return warehouse.get(options.id);
                } else {

                    // get the first value
                    return warehouse.values().next().value;
                }
            },
            set: () => {
                throw new Error(
                    `Can not assign value of '${propertyKey}'. ` +
                    `Connected components are one-way links to their source. You can not assign them directly. ` +
                    `If you need a default value to use in un-connected situations (such as tests) define a getter.`);
            }
        });
    };
}