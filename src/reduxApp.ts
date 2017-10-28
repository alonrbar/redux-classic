import { createStore, Store, StoreEnhancer } from 'redux';
import { Component } from './components';
import { Connect } from './decorators/connect';
import { AppOptions, globalOptions, GlobalOptions } from './options';
import { IMap } from './types';
import { isPrimitive, log } from './utils';

// tslint:disable:ban-types

//
// internal
//

class VisitCounter {
    public value = 0;
}

export const DEFAULT_APP_NAME = 'default';

export const appsRepository: IMap<ReduxApp<any>> = {};

var appsCount = 0;

export type AppWarehouse = Map<Function, Map<any, any>>;

//
// public
//

export class ReduxApp<T extends object> {

    /**
     * Global redux-app options
     */
    public static options: GlobalOptions = globalOptions;

    public readonly name: string;
    /**
     * The root component of the application.
     */
    public readonly root: T;
    /**
     * The underlying redux store.
     */
    public readonly store: Store<T>;

    private readonly warehouse: AppWarehouse = new Map<Function, Map<any, any>>();

    private subscriptionDisposer: () => void;

    constructor(appCreator: T, enhancer?: StoreEnhancer<T>);
    constructor(appCreator: T, options: AppOptions, enhancer?: StoreEnhancer<T>);
    constructor(appCreator: T, options: AppOptions, preloadedState: any, enhancer?: StoreEnhancer<T>);
    constructor(appCreator: T, ...params: any[]) {

        // handle different overloads
        var { options, storeParams } = this.resolveParameters(params);

        // assign name and register self
        this.name = this.getAppName(options.name);
        if (appsRepository[this.name])
            throw new Error(`An app with name '${this.name}' already exists.`);
        appsRepository[this.name] = this;

        // create the store        
        const initialReducer = (state: any) => state;
        this.store = createStore<T>(initialReducer as any, ...storeParams);

        // create the app
        const rootComponent = Component.create(this.store, appCreator, null, [this.name]);
        this.root = (rootComponent as any);

        // state        
        if (options.updateState) {
            this.subscriptionDisposer = this.store.subscribe(() => this.updateState());
        }

        // update the store
        const actualReducer = Component.getReducerFromTree(rootComponent);
        this.store.replaceReducer(actualReducer);

        // connect pending connection requests
        Connect.connect();
    }

    /**
     * Unsubscribe this instance from the it's underlying redux store.
     */
    public dispose(): void {
        if (this.subscriptionDisposer) {
            this.subscriptionDisposer();
            this.subscriptionDisposer = null;
        }
        if (appsRepository[this.name]) {
            delete appsRepository[this.name];
        }
    }

    /**
     * INTERNAL: Should not appear on the public d.ts file.
     */
    public getTypeWarehouse(type: Function): Map<any, any> {
        if (!this.warehouse.has(type))
            this.warehouse.set(type, new Map());
        return this.warehouse.get(type);
    }

    private getAppName(name: string): string {
        if (name)
            return name;

        return DEFAULT_APP_NAME + (appsCount++ ? '_' + appsCount : '');
    }

    private updateState(): void {

        //
        // Reducers are invoked with regular objects, therefor we use this
        // method which copies the resulted values back to the components.
        //

        const newState = this.store.getState();
        log.verbose('[updateState] Store before: ', newState);

        var counter = new VisitCounter();
        const visited = new Set();
        this.updateStateRecursion(this.root, newState, [], visited, counter);
        log.verbose('[updateState] Store after: ', newState);
    }

    private updateStateRecursion(obj: any, newState: any, path: string[], visited: Set<any>, counter: VisitCounter): any {
        counter.value++;

        // properties are updated by their holders
        if (isPrimitive(obj) || isPrimitive(newState))
            return newState;

        // prevent endless loops on circular references
        if (visited.has(obj))
            return obj;
        visited.add(obj);

        // log
        const pathStr = 'root' + (path.length ? '.' : '') + path.join('.');
        log.verbose(`[updateState] Updating app state in path '${pathStr}'`);
        log.verbose('[updateState] Scoped app state before: ', obj);

        // delete anything not in the new state
        var propsDeleted: string[] = [];
        Object.keys(obj).forEach(key => {
            if (!newState.hasOwnProperty(key)) {
                delete obj[key];
                propsDeleted.push(key);
            }
        });

        // assign new state recursively
        var propsAssigned: string[] = [];
        Object.keys(newState).forEach(key => {
            var subState = newState[key];
            var subObj = obj[key];
            const newSubObj = this.updateStateRecursion(subObj, subState, path.concat(key), visited, counter);

            // assign only if changed, in case anyone is monitoring changes
            if (newSubObj !== subObj) {
                obj[key] = newSubObj;
                propsAssigned.push(key);
            }
        });

        // log
        if (propsDeleted.length || propsAssigned.length) {
            log.debug(`[updateState] App state in path '${pathStr}' changed`);
            log.verbose('[updateState] Scoped app state after: ', obj);
            if (propsDeleted.length) {
                log.debug('[updateState] Props deleted: ', propsDeleted);
            } else {
                log.verbose('[updateState] Props deleted: ', propsDeleted);
            }
            if (propsAssigned.length) {
                log.debug('[updateState] Props assigned: ', propsAssigned);
            } else {
                log.verbose('[updateState] Props assigned: ', propsAssigned);
            }
        } else {
            log.verbose(`[updateState] No Change in path '${pathStr}'`);
        }

        return obj;
    }

    private resolveParameters(params: any[]) {
        var result: {
            options?: AppOptions,
            storeParams?: any
        } = {};

        if (params.length === 0) {

            // no parameters
            result.options = new AppOptions();

        } else if (params.length === 1) {

            if (typeof params[0] === 'function') {

                // only enhancer
                result.storeParams = params;
                result.options = new AppOptions();

            } else {

                // only options
                result.options = Object.assign(new AppOptions(), params[0]);

            }
        } else {

            // options and other store params
            result.options = Object.assign(new AppOptions(), params[0]);
            result.storeParams = params.slice(1);
        }

        return result;
    }
}