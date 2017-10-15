import { Store, createStore, StoreEnhancer } from "redux";
import { IAutomataTree, Automaton, getReducer, ICreatorsMap, AutomatonCreator, createTree } from "lib/automata";

// export interface StoreCreator {
//     <S>(automata: IAutomataTree | Automaton<any, any>, enhancer?: StoreEnhancer<S>): Store<S>;
//     <S>(automata: IAutomataTree | Automaton<any, any>, preloadedState: S, enhancer?: StoreEnhancer<S>): Store<S>;
// }

export interface IReduxAutomata {
    automata: IAutomataTree | Automaton<any, any>,
    store: Store<any>
}

export const reduxAutomata = (map: ICreatorsMap | AutomatonCreator<any, any>, ...params: any[]): IReduxAutomata => {
    const dummyReducer = () => { };
    const store = createStore(dummyReducer, ...params);
    const automata = createTree(store, map);
    const actualReducer = getReducer(automata);
    store.replaceReducer(actualReducer);
    return {
        automata,
        store
    };
}