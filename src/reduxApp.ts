import { createStore, Store, StoreEnhancer } from 'redux';
import { CombineReducersContext, Component, ComponentCreationContext, ComponentReducer } from './components';
import { ComponentId, Computed, IgnoreState } from './decorators';
import { ComponentInfo } from './info';
import { AppOptions, globalOptions, GlobalOptions } from './options';
import { IMap, Listener } from './types';
import { isPrimitive, log, toPlainObject } from './utils';
var getProp = require('lodash.get');

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
     * Get an existing ReduxApp instance.
     * 
     * @param appId The name of the ReduxApp instance to retrieve. If not
     * specified will return the default app.
     */
    public static getApp<T extends object = any>(appId?: string): ReduxApp<T> {
        const applicationId = appId || DEFAULT_APP_NAME;
        const app = appsRepository[applicationId];
        if (!app) 
            log.debug(`[ReduxApp] Application '${applicationId}' does not exist.`);
        return app;
    }

    /**
     * @param type The type of the component.
     * @param componentId The ID of the component (assuming the ID was assigned
     * to the component by the 'withId' decorator). If not specified will get to
     * the first available component of that type.
     * @param appId The name of the ReduxApp instance to search in. If not
     * specified will search in default app.
     */
    public static getComponent<T extends Function>(type: T, componentId?: string, appId?: string): T {
        const app = ReduxApp.getApp(appId);
        if (!app) 
            return undefined;

        // get the component to connect
        const warehouse = app.getTypeWarehouse(type);
        if (componentId) {

            // get by id
            return warehouse.get(componentId);
        } else {

            // get the first value
            return warehouse.values().next().value;
        }
    }

    /**
     * Whether or not the component was changed as a result of the last
     * dispatched action.
     * @param comp The component to check.
     * @param appId The name of the ReduxApp instance to check against. If not
     * specified will check against default app.
     */
    public static wasComponentChanged(comp: any, appId?: string): boolean {
        const app = ReduxApp.getApp(appId);
        if (!app) 
            return undefined;

        if (app.allComponentsChanged)
            return true;

        return Object.values(app.changedComponents).includes(comp);
    }

    /**
     * INTERNAL: Should not appear on the public d.ts file.
     */
    public static registerComponent(comp: Component, creator: object, appName?: string): void {
        appName = appName || DEFAULT_APP_NAME;
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

    private initialStateUpdated = false;

    /**
     * A map of components that were changed as a result of the last action dispatched.
     */
    private changedComponents: IMap<Component> = {};

    /**
     * Indicates whether all components were changed as a result of the last
     * action dispatched. This value is of higher precedence than the
     * 'changedComponents' property (i.e. it is the more accurate of that two
     * properties and should always be checked first).
     */
    private allComponentsChanged = false;

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

        // create the root reducer
        const reducersContext = new CombineReducersContext({
            componentPaths: Object.keys(creationContext.createdComponents)
        });
        const rootReducer = ComponentReducer.combineReducersTree(this.root, reducersContext);

        // update the store
        if (options.updateState) {
            const stateListener = this.updateState(creationContext.createdComponents, reducersContext);
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

    private updateState(allComponents: IMap<Component>, reducersContext: CombineReducersContext): Listener {

        const withComputedProps = Computed.filterComponents(Object.values(allComponents));

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
                this.changedComponents = {};
                this.allComponentsChanged = true;
            } else {

                // standard update - update only changed components
                this.updateChangedComponents({ [ROOT_COMPONENT_PATH]: newState }, reducersContext.changedComponents);
                this.changedComponents = Object.assign({}, reducersContext.changedComponents);
                this.allComponentsChanged = false;
            }

            // because computed props may be dependant on other components props their
            // calculation is postponed to after the entire app tree is up-to-date
            const changedByComputedProps = Computed.computeProps(withComputedProps);
            for (let comp of changedByComputedProps) {
                const path = Object.keys(allComponents).find(p => allComponents[p] === comp);
                this.changedComponents[path] = comp;
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

        // convert to plain object (see comment on the option itself)
        if (globalOptions.convertToPlainObject)
            newState = toPlainObject(newState);

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

            // see comment about computed properties in updateState
            if (Computed.isComputedProperty(obj, key))
                return;

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