import { createStore, Store, StoreEnhancer } from 'redux';
import { Component } from './components';
import { Connect } from './decorators';
import { AppOptions, globalOptions, GlobalOptions } from './options';
import { IMap } from './types';
import { isPrimitive, log, pathString } from './utils';

// tslint:disable:ban-types

//
// internal
//

export const DEFAULT_APP_NAME = 'default';

export const appsRepository: IMap<ReduxApp<any>> = {};

var appsCount = 0;

export type AppWarehouse = Map<Function, Map<any, any>>;

//
// public
//

export class ReduxApp<T extends object> {

    //
    // static
    //

    /**
     * Global redux-app options
     */
    public static options: GlobalOptions = globalOptions;

    public static createApp<T extends object>(appCreator: T, enhancer?: StoreEnhancer<T>): ReduxApp<T>;
    public static createApp<T extends object>(appCreator: T, options: AppOptions, enhancer?: StoreEnhancer<T>): ReduxApp<T>;
    public static createApp<T extends object>(appCreator: T, options: AppOptions, preloadedState: any, enhancer?: StoreEnhancer<T>): ReduxApp<T>;
    public static createApp<T extends object>(appCreator: T, ...params: any[]): ReduxApp<T> {
        return new ReduxApp(appCreator, ...params);
    }

    //
    // instance
    //

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
        var { options, preLoadedState, enhancer } = this.resolveParameters(params);

        // assign name and register self
        this.name = this.getAppName(options.name);
        if (appsRepository[this.name])
            throw new Error(`An app with name '${this.name}' already exists.`);
        appsRepository[this.name] = this;

        // create the store        
        const initialReducer = (state: any) => state;
        this.store = createStore<T>(initialReducer as any, preLoadedState, enhancer);

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
    }

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

    private resolveParameters(params: any[]) {
        var result: {
            options?: AppOptions,
            preLoadedState?: T,
            enhancer?: StoreEnhancer<T>
        } = {};

        if (params.length === 0) {

            // no parameters
            result.options = new AppOptions();

        } else if (params.length === 1) {

            if (typeof params[0] === 'function') {

                // only enhancer
                result.options = new AppOptions();
                result.enhancer = params[0];

            } else {

                // only options
                result.options = Object.assign(new AppOptions(), params[0]);

            }
        } else if (params.length === 2) {

            // options and pre-loaded state
            result.options = Object.assign(new AppOptions(), params[0]);
            result.preLoadedState = JSON.parse(JSON.stringify(params[1]));

        } else {

            // options, pre-loaded state and enhancer
            result.options = Object.assign(new AppOptions(), params[0]);
            result.preLoadedState = JSON.parse(JSON.stringify(params[1]));
            result.enhancer = params[2];
        }

        return result;
    }

    private getAppName(name: string): string {
        if (name)
            return name;

        if (!Object.keys(appsRepository).length) {
            return DEFAULT_APP_NAME;
        } else {
            return DEFAULT_APP_NAME + '_' + (++appsCount);
        }
    }

    private updateState(): void {

        //
        // Reducers are invoked with regular objects, therefor we use this
        // method which copies the resulted values back to the components.
        //

        const newState = this.store.getState();
        log.verbose('[updateState] Store before: ', newState);

        const visited = new Set();
        this.updateStateRecursion(this.root, newState, [], visited);

        log.verbose('[updateState] Store after: ', newState);
    }

    private updateStateRecursion(obj: any, newState: any, path: string[], visited: Set<any>): any {

        // same object
        if (obj === newState)
            return newState;

        // primitive properties are updated by their owner objects
        if (isPrimitive(obj) || isPrimitive(newState))
            return newState;

        // prevent endless loops on circular references
        if (visited.has(obj))
            return obj;
        visited.add(obj);

        // update
        const targetType = obj.constructor;
        const newStateType = newState.constructor;

        if ((targetType === newStateType) || newStateType === Object) {

            // update if:
            // 1. same type
            // 2. new state is a plain object (this is the reason we update recursively, to keep methods while updating props)
            var changeMessage: string;
            if (Array.isArray(obj) && Array.isArray(newState)) {
                changeMessage = this.updateArray(obj, newState, path, visited);
            } else {
                changeMessage = this.updateObject(obj, newState, path, visited);
            }
        } else {

            // overwrite, since those are different types (and the newState is not a plain object)
            return newState;
        }

        // log
        if (changeMessage && changeMessage.length) {
            log.debug(`[updateState] App state in path '${pathString(path)}' changed.`);
            log.debug(`[updateState] ${changeMessage}`);
            log.verbose(`[updateState] New state: `, obj);
        } else {
            log.verbose(`[updateState] No change in path '${pathString(path)}'.`);
        }

        return obj;
    }

    private updateObject(obj: any, newState: any, path: string[], visited: Set<any>): string {

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

            // state of connected components is update on their source
            if (Connect.getConnectionInfo(obj, key))
                return;

            var subState = newState[key];
            var subObj = obj[key];

            // must update recursively, otherwise we may lose children types (and methods...)
            const newSubObj = this.updateStateRecursion(subObj, subState, path.concat(key), visited);

            // assign only if changed, in case anyone is monitoring assignments
            if (newSubObj !== subObj) {
                obj[key] = newSubObj;
                propsAssigned.push(key);
            }
        });

        // log
        if (propsDeleted.length || propsAssigned.length) {
            const propsDeleteMessage = `Props deleted: ${propsDeleted.length ? propsDeleted.join(', ') : '<none>'}.`;
            const propsAssignedMessage = `Props assigned: ${propsAssigned.length ? propsAssigned.join(', ') : '<none>'}.`;
            return propsAssignedMessage + ' ' + propsDeleteMessage;
        } else {
            return null;
        }
    }

    private updateArray(arr: any[], newState: any[], path: string[], visited: Set<any>): string {

        var changeMessage: string[] = [];

        const prevLength = arr.length;
        const newLength = newState.length;

        // assign existing
        var itemsAssigned: number[] = [];
        for (let i = 0; i < Math.min(prevLength, newLength); i++) {
            var subState = newState[i];
            var subObj = arr[i];
            const newSubObj = this.updateStateRecursion(subObj, subState, path.concat(i.toString()), visited);
            if (newSubObj !== subObj) {
                arr[i] = newSubObj;
                itemsAssigned.push(i);
            }
        }
        if (itemsAssigned.length)
            changeMessage.push(`Assigned item(s) at indexes ${itemsAssigned.join(', ')}.`);

        // add / remove
        if (newLength > prevLength) {

            // add new items
            const newItems = newState.slice(prevLength);
            Array.prototype.push.apply(arr, newItems);
            changeMessage.push(`Added ${newLength - prevLength} item(s) at index ${prevLength}.`);

        } else if (prevLength > newLength) {

            // remove old items
            arr.splice(newLength);
            changeMessage.push(`Removed ${prevLength - newLength} item(s) at index ${newLength}.`);
        }

        return changeMessage.join(' ');
    }   
}