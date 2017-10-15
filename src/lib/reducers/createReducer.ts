import { AnyAction, combineReducers, Reducer, ReducersMapObject } from 'redux';
import { IActionsMap } from '../actions';
import { AUTOMATON_CREATOR, AUTOMATON_INITIAL_STATE } from '../automata';
import { IStateListener, ReducerCreator } from './types';

export function createReducer<TState, TActions extends IActionsMap<TState>>(creator: ReducerCreator<TState, TActions>, listener?: IStateListener<TState>): Reducer<TState> {

    var reducersMap = creator(undefined);

    return (state: TState, action: AnyAction) => {

        if (state === undefined)
            return (creator as any)[AUTOMATON_INITIAL_STATE];

        // check if should use this reducer
        if (typeof reducersMap[action.type] !== 'function')
            return state;

        // create new reducer for the current state
        reducersMap = creator(state);
        var actionReducer = reducersMap[action.type];
        if (typeof actionReducer === 'function') {
            const newState = actionReducer(...action.payload);

            // notify listener
            if (listener)
                listener(newState);

            // return new state
            return newState;
        }

        // no matching action
        return state;
    };
}