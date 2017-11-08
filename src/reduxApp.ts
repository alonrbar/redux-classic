import { createStore, Store, StoreEnhancer } from 'redux';
import { Component, ComponentReducer } from './components';
import { ComponentId, Computed, Connect } from './decorators';
import { ComponentInfo } from './info';
import { AppOptions, globalOptions, GlobalOptions } from './options';
import { IMap } from './types';
import { isPrimitive, log, pathString, toPlainObject } from './utils';

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

    /**
     * INTERNAL: Should not appear on the public d.ts file.
     */
    public static registerComponent(comp: Component, creator: object, path: string[]): void {
        const appName = path[0] || DEFAULT_APP_NAME;
        const app = appsRepository[appName];
        if (app) {  // this check exists for test reason only - in some unit tests we create orphan components that are not part of any app...
            const warehouse = app.getTypeWarehouse(creator.constructor);
            const key = ComponentInfo.getInfo(comp).id || ComponentId.nextAvailableId();
            warehouse.set(key, comp);
        }
    }

    //
    // instance members
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

    //
    // constructor
    //

    constructor(appCreator: T, enhancer?: StoreEnhancer<T>);
    constructor(appCreator: T, options: AppOptions, enhancer?: StoreEnhancer<T>);
    constructor(appCreator: T, options: AppOptions, preloadedState: any, enhancer?: StoreEnhancer<T>);
    constructor(appCreator: T, ...params: any[]) {

        // handle different overloads
        var { options, preLoadedState, enhancer } = this.resolveParameters(appCreator, params);

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
        const actualReducer = ComponentReducer.combineReducersTree(rootComponent);
        this.store.replaceReducer(actualReducer);
    }

    //
    // public methods
    //

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

    //
    // private utils
    //

    private resolveParameters(appCreator: any, params: any[]) {
        var result: {
            options?: AppOptions,
            preLoadedState?: T,
            enhancer?: StoreEnhancer<T>
        } = {};

        if (params.length === 0) {

            // no parameters
            result.options = new AppOptions();
            result.preLoadedState = appCreator;

        } else if (params.length === 1) {

            if (typeof params[0] === 'function') {

                // only enhancer
                result.options = new AppOptions();
                result.enhancer = params[0];
                result.preLoadedState = appCreator;

            } else {

                // only options
                result.options = Object.assign(new AppOptions(), params[0]);
                result.preLoadedState = appCreator;

            }
        } else if (params.length === 2) {

            // options and pre-loaded state
            result.options = Object.assign(new AppOptions(), params[0]);
            result.preLoadedState = params[1];

        } else {

            // options, pre-loaded state and enhancer
            result.options = Object.assign(new AppOptions(), params[0]);
            result.preLoadedState = params[1];
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

    //
    // update state
    //

    private updateState(): void {

        //
        // Reducers are invoked with regular objects, therefor we use this
        // method which copies the resulted values back to the components.
        //

        const start = Date.now();

        var newState = this.store.getState();
        if (globalOptions.convertToPlainObject)
            newState = toPlainObject(newState);
        log.verbose('[updateState] Store before: ', newState);

        const visited = new Set();
        const changedComponents = new Set();
        this.updateStateRecursion(this.root, newState, [this.name], visited, changedComponents);

        const end = Date.now();

        log.debug(`[updateState] Component tree updated in ${end - start}ms.`);
        log.verbose('[updateState] Store after: ', newState);

        // TODO: notify changes
    }

    private updateStateRecursion(obj: any, newState: any, path: string[], visited: Set<any>, changedPaths: Set<string>): any {

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
                changeMessage = this.updateArray(obj, newState, path, visited, changedPaths);
            } else {
                changeMessage = this.updateObject(obj, newState, path, visited, changedPaths);
            }
        } else {

            // overwrite, since those are different types (and the newState is not a plain object)
            return newState;
        }

        // handle changes
        const pathStr = pathString(path);
        if (changeMessage && changeMessage.length) {

            // register for later
            if (obj instanceof Component && !changedPaths.has(pathStr))
                changedPaths.add(pathStr);

            // log
            log.debug(`[updateState] Change in '${pathStr}'. ${changeMessage}`);
            log.verbose(`[updateState] New state: `, obj);

        } else {
            log.verbose(`[updateState] No change in path '${pathStr}'.`);
        }

        return obj;
    }

    private updateObject(obj: any, newState: any, path: string[], visited: Set<any>, changedPaths: Set<string>): string {

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
            if (Connect.isConnectedProperty(obj, key))
                return;

            var subState = newState[key];
            var subObj = obj[key];

            // must update recursively, otherwise we may lose children types (and methods...)
            const newSubObj = this.updateStateRecursion(subObj, subState, path.concat(key), visited, changedPaths);

            // assign only if changed, in case anyone is monitoring assignments
            if (newSubObj !== subObj) {
                obj[key] = newSubObj;
                propsAssigned.push(key);
            }
        });

        // calculate and assign computed props
        Computed.computeProps(obj);

        // report changes
        if (propsAssigned.length || propsDeleted.length) {
            const propsAssignedMessage = propsAssigned.length ? `Props assigned: ${propsAssigned.join(', ')}.` : '';
            const propsDeleteMessage = propsDeleted.length ? `Props deleted: ${propsDeleted.join(', ')}.` : '';
            const space = (propsAssigned.length && propsDeleted.length) ? ' ' : '';
            return propsAssignedMessage + space + propsDeleteMessage;

        } else {
            return null;
        }
    }

    private updateArray(arr: any[], newState: any[], path: string[], visited: Set<any>, changedPaths: Set<string>): string {

        var changeMessage: string[] = [];

        const prevLength = arr.length;
        const newLength = newState.length;

        // assign existing
        var itemsAssigned: number[] = [];
        for (let i = 0; i < Math.min(prevLength, newLength); i++) {
            var subState = newState[i];
            var subObj = arr[i];
            const newSubObj = this.updateStateRecursion(subObj, subState, path.concat(i.toString()), visited, changedPaths);
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

        // report changes
        return changeMessage.join(' ');
    }
}