import { Store, createStore, StoreEnhancer } from "redux";
import { ComponentTree, ComponentTreeCreator } from "./components";

export class ReduxApp<S = any> {

    public readonly root: ComponentTree;
    public readonly store: Store<S>;

    constructor(treeCreator: ComponentTreeCreator, enhancer?: StoreEnhancer<S>);
    constructor(treeCreator: ComponentTreeCreator, preloadedState: S, enhancer?: StoreEnhancer<S>);
    constructor(treeCreator: ComponentTreeCreator, ...params: any[]) {
        
        // create the store
        const dummyReducer = () => { };
        this.store = createStore<S>(dummyReducer as any, ...params);
        
        // create the app
        this.root = new ComponentTree(this.store, treeCreator);
        const actualReducer = this.root.getReducer();
        
        // update the store
        this.store.replaceReducer(actualReducer);
    }
}