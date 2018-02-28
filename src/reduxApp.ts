import { createStore, Store, StoreEnhancer } from 'redux';
import { CombineReducersContext, Component, ComponentCreationContext, ComponentReducer } from './components';
import { ComponentId, IgnoreState } from './decorators';
import { ComponentInfo } from './info';
import { AppOptions, globalOptions, GlobalOptions } from './options';
import { Constructor, IMap, Listener } from './types';
import { isPrimitive, log } from './utils';
const getProp = require('lodash.get');

// tslint:disable:ban-types

//
// internal
//

export const ROOT_COMPONENT_PATH = 'root';

export const DEFAULT_APP_NAME = 'default';

export const appsRepository: IMap<ReduxApp<any>> = {};

export type AppWarehouse = Map<Function, Map<any, any>>;

var appsCount = 0;

class UpdateContext {

    public visited = new Set();
    public path = ROOT_COMPONENT_PATH;
    public forceRecursion = false;

    constructor(initial?: Partial<UpdateContext>) {
        Object.assign(this, initial);
    }
}

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
     * @param type The type of the component.
     * @param componentId The ID of the component (assuming the ID was assigned
     * to the component by the 'withId' decorator). If not specified will get to
     * the first available component of that type.
     * @param appId The name of the ReduxApp instance to search in. If not
     * specified will search in default app.
     * @throws If not found.
     */
    public static getComponent<T>(type: Constructor<T>, componentId?: string, appId?: string): T {
        const app = ReduxApp.getApp(appId);
        if (!app)
            throw new Error(`App not found (id: '${appId || DEFAULT_APP_NAME}')`);

        // get the component
        const warehouse = app.getTypeWarehouse(type);
        if (componentId) {

            // get by id
            const comp = warehouse.get(componentId);
            if (!comp)
                throw new Error(`Component not found. Type: ${type.name}. Id: '${componentId}'.`);
            return comp;
        } else {

            // get the first value
            const comp = warehouse.values().next().value;
            if (!comp)
                throw new Error(`Component not found. Type: ${type.name}.`);
            return comp;
        }
    }

    /**
     * Get an existing ReduxApp instance.
     * 
     * @param appId The name of the ReduxApp instance to retrieve. If not
     * specified will return the default app.
     */
    private static getApp<T extends object = any>(appId?: string): ReduxApp<T> {
        const applicationId = appId || DEFAULT_APP_NAME;
        const app = appsRepository[applicationId];
        if (!app)
            log.debug(`[ReduxApp] Application '${applicationId}' does not exist.`);
        return app;
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

    private initialStateUpdated = false;

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
        const creationContext = new ComponentCreationContext({ appName: this.name });
        const rootComponent = Component.create(this.store, appCreator, creationContext);
        this.root = (rootComponent as any);
        this.registerComponents(creationContext.createdComponents);

        // create the root reducer
        const reducersContext = new CombineReducersContext({
            componentPaths: Object.keys(creationContext.createdComponents)
        });
        const rootReducer = ComponentReducer.combineReducersTree(this.root, reducersContext);

        // update the store
        if (options.updateState) {
            const stateListener = this.updateState(reducersContext);
            this.subscriptionDisposer = this.store.subscribe(stateListener);
        }
        this.store.replaceReducer(rootReducer);
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

    private registerComponents(components: IMap<Component>): void {
        for (const comp of Object.values(components)) {
            const compInfo = ComponentInfo.getInfo(comp);
            const warehouse = this.getTypeWarehouse(compInfo.originalClass);
            const key = compInfo.id || ComponentId.nextAvailableId();
            warehouse.set(key, comp);
        }
    }

    private getTypeWarehouse(type: Function): Map<any, any> {
        if (!this.warehouse.has(type))
            this.warehouse.set(type, new Map());
        return this.warehouse.get(type);
    }

    //
    // update state
    //

    private updateState(reducersContext: CombineReducersContext): Listener {
        return () => {

            //
            // Reducers are invoked with regular objects, therefor we use this
            // method which copies the resulted values back to the components.
            //

            const start = Date.now();

            // update the application tree
            const newState = this.store.getState();
            if (!this.initialStateUpdated || !reducersContext.invoked) {

                // initial state, state rehydration, time-travel debugging, etc. - update the entire tree
                this.initialStateUpdated = true;
                this.updateStateRecursion(this.root, newState, new UpdateContext({ forceRecursion: true }));
            } else {

                // standard update - update only changed components
                this.updateChangedComponents({ [ROOT_COMPONENT_PATH]: newState }, reducersContext.changedComponents);
            }

            // reset reducers context
            reducersContext.reset();

            const end = Date.now();

            log.debug(`[updateState] Component tree updated in ${end - start}ms.`);
        };
    }

    private updateChangedComponents(newState: any, changedComponents: IMap<Component>): void {

        const changedPaths = Object.keys(changedComponents);
        const updateContext = new UpdateContext();

        for (let path of changedPaths) {

            const curComponent = changedComponents[path];
            var newSubState = getProp(newState, path);

            this.updateStateRecursion(curComponent, newSubState, {
                ...updateContext,
                path
            });
        }
    }

    private updateStateRecursion(obj: any, newState: any, context: UpdateContext): any {

        // same object
        if (obj === newState)
            return newState;

        // primitive properties are updated by their owner objects
        if (isPrimitive(obj) || isPrimitive(newState))
            return newState;

        // prevent endless loops on circular references
        if (context.visited.has(obj))
            return obj;
        context.visited.add(obj);

        // update
        const newStateType = newState.constructor;

        if (context.forceRecursion || (obj instanceof Component && newStateType === Object)) {

            // update if new state is a plain object (so to keep methods while updating props)
            var changeMessage: string;
            if (Array.isArray(obj) && Array.isArray(newState)) {
                changeMessage = this.updateArray(obj, newState, context);
            } else {
                changeMessage = this.updateObject(obj, newState, context);
            }
        } else {

            // overwrite
            obj = newState;
            changeMessage = 'Object overwritten.';
        }

        // log changes
        if (changeMessage && changeMessage.length) {
            log.debug(`[updateState] Change in '${context.path}'. ${changeMessage}`);
            log.verbose(`[updateState] New state: `, obj);
        }

        return obj;
    }

    private updateObject(obj: any, newState: any, context: UpdateContext): string {

        // delete anything not in the new state
        var propsDeleted: string[] = [];
        Object.keys(obj).forEach(key => {

            if (IgnoreState.isIgnoredProperty(obj, key))
                return;

            if (!newState.hasOwnProperty(key)) {
                if (typeof obj[key] === 'function')
                    log.warn(`[updateState] Function property removed in path: ${context.path}.${key}. Consider using a method instead.`);
                delete obj[key];
                propsDeleted.push(key);
            }
        });

        // assign new state recursively
        var propsAssigned: string[] = [];
        Object.keys(newState).forEach(key => {

            if (IgnoreState.isIgnoredProperty(obj, key))
                return;

            var subState = newState[key];
            var subObj = obj[key];

            // must update recursively, otherwise we may lose children types (and methods...)
            const newSubObj = this.updateStateRecursion(subObj, subState, {
                ...context,
                path: context.path + '.' + key
            });

            // assign only if changed, in case anyone is monitoring assignments
            if (newSubObj !== subObj) {
                obj[key] = newSubObj;
                propsAssigned.push(key);
            }
        });

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

    private updateArray(arr: any[], newState: any[], context: UpdateContext): string {

        var changeMessage: string[] = [];

        const prevLength = arr.length;
        const newLength = newState.length;

        // assign existing
        var itemsAssigned: number[] = [];
        for (let i = 0; i < Math.min(prevLength, newLength); i++) {
            var subState = newState[i];
            var subObj = arr[i];
            const newSubObj = this.updateStateRecursion(subObj, subState, {
                ...context,
                path: context.path + '.' + i
            });
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