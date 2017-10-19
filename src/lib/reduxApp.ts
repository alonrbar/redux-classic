import { AnyAction, createStore, Reducer, ReducersMapObject, Store, StoreEnhancer } from 'redux';
import { Component, REDUCER } from './component';
import { GlobalOptions } from './globalOptions';
import { simpleCombineReducers } from './reducers';

export class ReduxApp<T> {

    public static options = new GlobalOptions();

    public readonly root: T;
    public readonly store: Store<T>;

    constructor(appSchema: T, enhancer?: StoreEnhancer<T>);
    constructor(appSchema: T, preloadedState: T, enhancer?: StoreEnhancer<T>);
    constructor(appSchema: T, ...params: any[]) {
        
        // create the store
        const dummyReducer = () => { /* noop  */ };
        this.store = createStore<T>(dummyReducer as any, ...params);

        // create the app
        const rootComponent = new Component(this.store, appSchema, []);
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
                const subStates = combinedSubReducer(state, action);

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