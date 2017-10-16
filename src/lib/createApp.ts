import { Store, createStore, StoreEnhancer } from "redux";
import { IComponentTree, Component, getReducer, ICreatorsMap, ComponentCreator, createTree } from "./components";

// export interface StoreCreator {
//     <S>(component: IcomponentTree | ComponentCreator<any, any>, enhancer?: StoreEnhancer<S>): Store<S>;
//     <S>(component: IcomponentTree | ComponentCreator<any, any>, preloadedState: S, enhancer?: StoreEnhancer<S>): Store<S>;
// }

export interface IReduxApp {
    component: IComponentTree | Component<any, any>,
    store: Store<any>
}

export const createApp = (map: ICreatorsMap | ComponentCreator<any, any>, ...params: any[]): IReduxApp => {
    const dummyReducer = () => { };
    const store = createStore(dummyReducer, ...params);
    const component = createTree(store, map);
    const actualReducer = getReducer(component);
    store.replaceReducer(actualReducer);
    return {
        component,
        store
    };
}