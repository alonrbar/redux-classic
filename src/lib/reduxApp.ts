import { Store, createStore, StoreEnhancer } from "redux";
import { Component, IActionsMap, IComponentSchemaTree, TypedComponent } from "./components";

export class ReduxApp<TState = any, TActions extends IActionsMap<TState> = any> {

    public readonly root: TypedComponent<TState, TActions>;
    public readonly store: Store<TState>;

    constructor(treeCreator: IComponentSchemaTree, enhancer?: StoreEnhancer<TState>);
    constructor(treeCreator: IComponentSchemaTree, preloadedState: TState, enhancer?: StoreEnhancer<TState>);
    constructor(treeCreator: IComponentSchemaTree, ...params: any[]) {
        
        // create the store
        const dummyReducer = () => { };
        this.store = createStore<TState>(dummyReducer as any, ...params);
        
        // create the app
        this.root = new Component(this.store.dispatch, treeCreator) as any;
        const actualReducer = this.root.getReducer();
        
        // update the store
        this.store.replaceReducer(actualReducer);
    }
}