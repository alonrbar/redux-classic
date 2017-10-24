import { createStore, Store, StoreEnhancer } from 'redux';
import { Component } from './components';
import { globalOptions, GlobalOptions } from './options';

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
        const rootComponent = Component.create(this.store, appSchema);
        this.root = (rootComponent as any);
        
        // update the store
        const actualReducer = Component.getReducerFromTree(rootComponent);
        this.store.replaceReducer(actualReducer);
    }    
}