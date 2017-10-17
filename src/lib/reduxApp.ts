import { Store, createStore, StoreEnhancer } from "redux";
import { Component } from "./components";

export class ReduxApp<T> {

    public readonly root: T;
    public readonly store: Store<T>;

    constructor(appSchema: any, enhancer?: StoreEnhancer<T>);
    constructor(appSchema: any, preloadedState: T, enhancer?: StoreEnhancer<T>);
    constructor(appSchema: any, ...params: any[]) {
        
        // create the store
        const dummyReducer = () => { };
        this.store = createStore<T>(dummyReducer as any, ...params);
        
        // create the app
        const rootComponent = new Component(this.store.dispatch, appSchema);
        const actualReducer = rootComponent.getReducer();
        this.root = (rootComponent as any);
        
        // update the store
        this.store.replaceReducer(actualReducer);
    }
}