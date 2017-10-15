import { Store, createStore as reduxCreateStore, StoreEnhancer } from "redux";
import { IAutomataTree, Automaton, getReducer } from "lib/automata";

export interface StoreCreator {
    <S>(automata: IAutomataTree | Automaton<any, any>, enhancer?: StoreEnhancer<S>): Store<S>;
    <S>(automata: IAutomataTree | Automaton<any, any>, preloadedState: S, enhancer?: StoreEnhancer<S>): Store<S>;
}

export const createStore: StoreCreator = (automata: IAutomataTree | Automaton<any, any>, ...params: any[]): Store<any> => {
    const dummyReducer = () => { };
    const store = reduxCreateStore(dummyReducer, ...params);
    const actualReducer = getReducer(automata);
    store.replaceReducer(actualReducer);
    return store;
}