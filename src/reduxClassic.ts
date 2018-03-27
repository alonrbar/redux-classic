import { createStore, Store, StoreEnhancer } from 'redux';
import { IgnoreState, ModuleId } from './decorators';
import { ModuleInfo } from './info';
import { CombineReducersContext, Module, ModuleCreationContext, ModuleReducer } from './module';
import { AppOptions, globalOptions, GlobalOptions } from './options';
import { Constructor, IMap, Listener } from './types';
import { isPrimitive, log } from './utils';
const getProp = require('lodash.get');

// tslint:disable:ban-types

//
// internal
//

export const ROOT_MODULE_PATH = 'root';

export const DEFAULT_APP_NAME = 'default';

export const appsRepository: IMap<ReduxClassic<any>> = {};

export type AppWarehouse = Map<Function, Map<any, any>>;

var appsCount = 0;

class UpdateContext {

    public visited = new Set();
    public path = ROOT_MODULE_PATH;
    public forceRecursion = false;

    constructor(initial?: Partial<UpdateContext>) {
        Object.assign(this, initial);
    }
}

//
// public
//

export class ReduxClassic<T extends object> {

    //
    // static
    //

    /**
     * Global options
     */
    public static options: GlobalOptions = globalOptions;

    public static create<T extends object>(rootModuleTemplate: T, enhancer?: StoreEnhancer<T>): ReduxClassic<T>;
    public static create<T extends object>(rootModuleTemplate: T, options: AppOptions, enhancer?: StoreEnhancer<T>): ReduxClassic<T>;
    public static create<T extends object>(rootModuleTemplate: T, options: AppOptions, preloadedState: any, enhancer?: StoreEnhancer<T>): ReduxClassic<T>;
    public static create<T extends object>(rootModuleTemplate: T, ...params: any[]): ReduxClassic<T> {
        return  new ReduxClassic(rootModuleTemplate, ...params);
    }

    /**
     * @param type The type of the module.
     * @param moduleId The ID of the module (assuming the ID was assigned
     * to the module by the 'withId' decorator). If not specified will get to
     * the first available module of that type.
     * @param appId The name of the ReduxClassic instance to search in. If not
     * specified will search in default app.
     * @throws If not found.
     */
    public static getModule<T>(type: Constructor<T>, moduleId?: string, appId?: string): T {
        const app = ReduxClassic.getTree(appId);
        if (!app)
            throw new Error(`App not found (id: '${appId || DEFAULT_APP_NAME}')`);

        // get the module
        const warehouse = app.getTypeWarehouse(type);
        if (moduleId) {

            // get by id
            const comp = warehouse.get(moduleId);
            if (!comp)
                throw new Error(`Module not found. Type: ${type.name}. Id: '${moduleId}'.`);
            return comp;
        } else {

            // get the first value
            const comp = warehouse.values().next().value;
            if (!comp)
                throw new Error(`Module not found. Type: ${type.name}.`);
            return comp;
        }
    }

    /**
     * Get an existing ReduxClassic instance.
     * 
     * @param appId The name of the ReduxClassic instance to retrieve. If not
     * specified will return the default app.
     */
    private static getTree<T extends object = any>(appId?: string): ReduxClassic<T> {
        const applicationId = appId || DEFAULT_APP_NAME;
        const app = appsRepository[applicationId];
        if (!app)
            log.debug(`[ReduxClassic] Application '${applicationId}' does not exist.`);
        return app;
    }

    //
    // instance members
    //

    public readonly name: string;
    /**
     * The root module of the application.
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

    private constructor(rootModuleTemplate: T, enhancer?: StoreEnhancer<T>);
    private constructor(rootModuleTemplate: T, options: AppOptions, enhancer?: StoreEnhancer<T>);
    private constructor(rootModuleTemplate: T, options: AppOptions, preloadedState: any, enhancer?: StoreEnhancer<T>);
    private constructor(rootModuleTemplate: T, ...params: any[]) {

        // handle different overloads
        var { options, preLoadedState, enhancer } = this.resolveParameters(rootModuleTemplate, params);

        // assign name and register self
        this.name = this.getAppName(options.name);
        if (appsRepository[this.name])
            throw new Error(`An app with name '${this.name}' already exists.`);
        appsRepository[this.name] = this;

        // create the store
        const initialReducer = (state: any) => state;
        this.store = createStore<T>(initialReducer as any, preLoadedState, enhancer);

        // create the app
        const creationContext = new ModuleCreationContext({ appName: this.name });
        const rootModule = Module.create(this.store, rootModuleTemplate, creationContext);
        this.root = (rootModule as any);
        this.registerModules(creationContext.createdModules);

        // create the root reducer
        const reducersContext = new CombineReducersContext({
            modulePaths: Object.keys(creationContext.createdModules)
        });
        const rootReducer = ModuleReducer.combineReducersTree(this.root, reducersContext);

        // listen to state changes
        if (options.updateState) {
            const stateListener = this.updateState(reducersContext);
            this.subscriptionDisposer = this.store.subscribe(stateListener);
        }

        // update the store
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

    private resolveParameters(rootModuleTemplate: any, params: any[]) {
        var result: {
            options?: AppOptions,
            preLoadedState?: T,
            enhancer?: StoreEnhancer<T>
        } = {};

        if (params.length === 0) {

            // no parameters
            result.options = new AppOptions();
            result.preLoadedState = rootModuleTemplate;

        } else if (params.length === 1) {

            if (typeof params[0] === 'function') {

                // only enhancer
                result.options = new AppOptions();
                result.enhancer = params[0];
                result.preLoadedState = rootModuleTemplate;

            } else {

                // only options
                result.options = Object.assign(new AppOptions(), params[0]);
                result.preLoadedState = rootModuleTemplate;

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

    private registerModules(modules: IMap<Module>): void {
        for (const comp of Object.values(modules)) {
            const compInfo = ModuleInfo.getInfo(comp);
            const warehouse = this.getTypeWarehouse(compInfo.originalClass);
            const key = compInfo.id || ModuleId.nextAvailableId();
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
            // method which copies the resulted values back to the modules.
            //

            const start = Date.now();

            // update the application tree
            const newState = this.store.getState();
            if (!this.initialStateUpdated || !reducersContext.invoked) {

                // initial state, state rehydration, time-travel debugging, etc. - update the entire tree
                this.initialStateUpdated = true;
                this.updateStateRecursion(this.root, newState, new UpdateContext({ forceRecursion: true }));
            } else {

                // standard update - update only changed modules
                this.updateChangedModules({ [ROOT_MODULE_PATH]: newState }, reducersContext.changedModules);
            }

            // reset reducers context
            reducersContext.reset();

            const end = Date.now();

            log.debug(`[updateState] Module tree updated in ${end - start}ms.`);
        };
    }

    private updateChangedModules(newState: any, changedModules: IMap<Module>): void {

        const changedPaths = Object.keys(changedModules);
        const updateContext = new UpdateContext();

        for (let path of changedPaths) {

            const curModule = changedModules[path];
            var newSubState = getProp(newState, path);

            this.updateStateRecursion(curModule, newSubState, {
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

        if (context.forceRecursion || (obj instanceof Module)) {

            // update
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
        for (const key of Object.keys(obj)) {

            if (IgnoreState.isIgnoredProperty(obj, key))
                continue;

            if (!newState.hasOwnProperty(key)) {

                // don't remove getters
                const desc = Object.getOwnPropertyDescriptor(obj, key);
                if (desc && typeof desc.get === 'function')
                    continue;

                // warn when removing function properties
                if (typeof obj[key] === 'function')
                    log.warn(`[updateState] Function property removed in path: ${context.path}.${key}. Consider using a method instead.`);

                // remove
                delete obj[key];
                propsDeleted.push(key);
            }
        }

        // assign new state recursively
        var propsAssigned: string[] = [];
        for (const key of Object.keys(newState)) {

            if (IgnoreState.isIgnoredProperty(obj, key))
                continue;

            // don't attempt to assign get only properties
            const desc = Object.getOwnPropertyDescriptor(obj, key);
            if (desc && typeof desc.get === 'function' && typeof desc.set !== 'function')
                continue;

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
        }

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