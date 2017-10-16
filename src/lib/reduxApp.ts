import { Store, createStore, StoreEnhancer } from "redux";
import { ComponentTree, ComponentTreeCreator } from "./components";

// export interface StoreCreator {
//     <S>(component: IcomponentTree, enhancer?: StoreEnhancer<S>): Store<S>;
//     <S>(component: IcomponentTree, preloadedState: S, enhancer?: StoreEnhancer<S>): Store<S>;
// }

export class ReduxApp<T> {

    public readonly root: ComponentTree;
    public readonly store: Store<T>;

    constructor(treeCreator: ComponentTreeCreator, ...params: any[]) {
        
        // create the store
        const dummyReducer = () => { };
        this.store = createStore<T>(dummyReducer as any, ...params);
        
        // create the app
        this.root = new ComponentTree(this.store, treeCreator);
        const actualReducer = this.root.getReducer();
        
        // update the store
        this.store.replaceReducer(actualReducer);
    }
}