import { AnyAction, createStore, Reducer, ReducersMapObject, Store, StoreEnhancer } from 'redux';
import { Component } from './components';
import { globalOptions, GlobalOptions } from './options';
import { simpleCombineReducers } from './utils';
import { REDUCER } from './symbols';

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

    constructor(appSchema: T, enhancer?: StoreEnhancer<T>);
    constructor(appSchema: T, preloadedState: T, enhancer?: StoreEnhancer<T>);
    constructor(appSchema: T, ...params: any[]) {
        
        // create the store
        const dummyReducer = () => { /* noop  */ };
        this.store = createStore<T>(dummyReducer as any, ...params);

        // create the app
        const rootComponent = new Component(this.store, appSchema, null, []);
        this.root = (rootComponent as any);
        
        // update the store
        const actualReducer = this.getReducer(rootComponent);
        this.store.replaceReducer(actualReducer);
    }

    private getReducer(component: Component<T>): Reducer<T> {
        const rootReducer = (component as any)[REDUCER];

        const subReducers: ReducersMapObject = {};
        for (let key of Object.keys(component)) {
            if ((component as any)[key] instanceof Component) {
                subReducers[key] = this.getReducer((component as any)[key]);
            }
        }

        // reducer with sub-reducers
        if (Object.keys(subReducers).length) {

            var combinedSubReducer = simpleCombineReducers(subReducers);

            return (state: T, action: AnyAction) => {
                const thisState = rootReducer(state, action);
                const subStates = combinedSubReducer(thisState, action);

                // merge self and sub states
                return {
                    ...thisState,
                    ...subStates
                };
            };
        }

        // single reducer
        return rootReducer;
    }
}