import 'reflect-metadata';
import { Schema } from '../components';
import { appsRepository, DEFAULT_APP_NAME } from '../reduxApp';
import { accessorDescriptor, dataDescriptor, log } from '../utils';
import { IMap } from '../types';

export class ConnectOptions {
    public app?= DEFAULT_APP_NAME;
    public id?: any;
    public live?= false;
}

class ConnectParams {
    public options: ConnectOptions;
    public target: any;
    public propertyKey: string | symbol;
}

export class Connect {

    private static readonly pendingConnections: IMap<ConnectParams[]> = {};

    public static addPendingConnection(options: ConnectOptions, target: any, propertyKey: string | symbol): void {
        options = Object.assign(new ConnectOptions(), options);

        if (!Connect.pendingConnections[options.app])
            Connect.pendingConnections[options.app] = [];

        Connect.pendingConnections[options.app].push({
            options,
            target,
            propertyKey
        });
    }

    public static connect(): void {

        

        const pending = Connect.pendingConnections[appName];
        if (!pending)
            return;

        pending.forEach(params => Connect.connectProperty(params));
    }

    private static connectProperty(params: ConnectParams) {

        const options = params.options;
        const target = params.target;
        const propertyKey = params.propertyKey;

        // get the property type 
        // (see 'metadata' section of https://www.typescriptlang.org/docs/handbook/decorators.html)
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
        if (!delete target[propertyKey])
            throw new Error(`[connect] Failed to create connected property '${propertyKey}'. Can not replace existing property.`);

        // and replace it with a new descriptor        
        Object.defineProperty(target, propertyKey, Object.assign({}, accessorDescriptor, {
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

                // set value
                if (oldDescriptor && oldDescriptor.set) {
                    return oldDescriptor.set(newValue);
                } else if (!oldDescriptor || oldDescriptor && oldDescriptor.writable) {
                    return value = newValue;
                }
            }
        }));
    }
}

/**
 * Property decorator.
 * Connects the component to the specified (or default) app.
 */
export function connect(options?: ConnectOptions): PropertyDecorator {
    return (target: any, propertyKey: string | symbol): void => {
        Connect.addPendingConnection(options, target, propertyKey);
        Connect.connect();
    };
}