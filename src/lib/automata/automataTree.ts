import { combineReducers, Reducer, ReducersMapObject, Store } from 'redux';
import { createReducer } from '../reducers';
import { Automaton } from './automaton';
import { AUTOMATON_CREATOR, AutomatonCreator, ICreatorsMap } from './automatonCreator';

export interface IAutomataTree {
    [key: string]: Automaton<any, any> | IAutomataTree;
}

export function createTree(store: Store<any>, map: ICreatorsMap | AutomatonCreator<any, any>): IAutomataTree | Automaton<any, any> {

    if (typeof map === 'object') {
        var resultTree: IAutomataTree = {};
        for (let key of Object.keys(map)) {
            let subTree = createTree(store, map[key] as any);
            if (subTree !== null)
                resultTree[key] = subTree;
        }
        return resultTree;

    } else if (typeof map === 'function') {
        if ((map as any)[AUTOMATON_CREATOR]) {
            return new Automaton(store, map);
        } else {
            throw new Error("Invalid argument 'map'. Function is not an automaton creator. Did you forget to call 'createAutomaton' or to invoke the creator?")
        }

    } else {
        throw new Error("Invalid argument 'map'. Must be an object or a function.")
    }
}

export function getReducer(automata: IAutomataTree | Automaton<any, any>): Reducer<any> {
    if (automata instanceof Automaton) {
        return automata.reducer;
    } else {
        const result: ReducersMapObject = {};
        for (let key of Object.keys(automata)) {
            result[key] = getReducer(automata[key]);
        }
        return combineReducers(result);
    }
}