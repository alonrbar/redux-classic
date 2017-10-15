import { ReducerCreator } from "../reducers";
import { IActionsMap } from "../actions";

export const AUTOMATON_CREATOR = Symbol('AUTOMATON_CREATOR');

export type AutomatonCreator<TState, TActions extends IActionsMap<TState>> = ReducerCreator<TState, TActions>;

export interface ICreatorsMap {
    [key: string]: AutomatonCreator<any, any> | ICreatorsMap;
}

export function automatonCreator<TState, TActions extends IActionsMap<TState>>(creator: ReducerCreator<TState, TActions>): AutomatonCreator<TState, TActions> {
    // ReducerCreators are just plain functions. That's why we decorate them to
    // distinguish them from other functions.
    (creator as any)[AUTOMATON_CREATOR] = true;
    return creator;
}