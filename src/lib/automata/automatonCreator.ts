import { ReducerCreator } from "../reducers";
import { IActionsMap } from "../actions";

export const AUTOMATON_CREATOR = Symbol('AUTOMATON_CREATOR');
export const AUTOMATON_INITIAL_STATE = Symbol('AUTOMATON_INITIAL_STATE');

export type AutomatonCreator<TState, TActions extends IActionsMap<TState>> = ReducerCreator<TState, TActions>;

export interface ICreatorsMap {
    [key: string]: AutomatonCreator<any, any> | ICreatorsMap;
}

export function automatonCreator<TState, TActions extends IActionsMap<TState>>(initialState: () => TState, creator: ReducerCreator<TState, TActions>): () => AutomatonCreator<TState, TActions> {
    return () => {

        // https://stackoverflow.com/questions/1833588/javascript-clone-a-function
        const creatorClone = creator.bind({});

        // ReducerCreators are just plain functions. That's why we decorate them to
        // distinguish them from other functions.
        (creatorClone as any)[AUTOMATON_CREATOR] = true;
        // in addition we store some useful information for later
        (creatorClone as any)[AUTOMATON_INITIAL_STATE] = initialState();

        return creatorClone;
    }
}