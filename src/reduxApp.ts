import { createStore, Store, StoreEnhancer } from 'redux';
import { Component } from './components';
import { AppOptions, globalOptions, GlobalOptions } from './options';
import { isPrimitive, log } from './utils';

class VisitCounter {
    public value = 0;
}

export class ReduxApp<T extends object> {

    /**
     * Global redux-app options
     */
    public static options: GlobalOptions = globalOptions;

    /**
     * The root component of the application.
     */
    public readonly root: T;
    /**
     * The underlying redux store.
     */
    public readonly store: Store<T>;

    private subscriptionDisposer: () => void;

    constructor(appCreator: T, enhancer?: StoreEnhancer<T>);
    constructor(appCreator: T, options: AppOptions, enhancer?: StoreEnhancer<T>);
    constructor(appCreator: T, options: AppOptions, preloadedState: any, enhancer?: StoreEnhancer<T>);
    constructor(appCreator: T, ...params: any[]) {

        // handle different overloads
        var { options, storeParams } = this.resolveParameters(params);

        // create the store        
        const initialReducer = (state: any) => state;
        this.store = createStore<T>(initialReducer as any, ...storeParams);

        // create the app
        const rootComponent = Component.create(this.store, appCreator);
        this.root = (rootComponent as any);

        // state        
        if (options.updateState) {
            this.subscriptionDisposer = this.store.subscribe(() => this.updateState());
        }

        // update the store
        const actualReducer = Component.getReducerFromTree(rootComponent);
        this.store.replaceReducer(actualReducer);
    }

    /**
     * Unsubscribe this instance from the it's underlying redux store.
     */
    public dispose(): void {
        if (this.subscriptionDisposer) {
            this.subscriptionDisposer();
            this.subscriptionDisposer = null;
        }
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