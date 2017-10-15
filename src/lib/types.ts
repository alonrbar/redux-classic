import { Dispatch, Reducer } from 'redux';

export type ReducerAction<TState> = (...payload: any[]) => TState;

export interface IActionsMap<TState> {
    [actionName: string]: ReducerAction<TState>;
}

export type ReducerCreator<TState, TActions extends IActionsMap<TState>> = (state: TState) => TActions;

export type IStateListener<TState> = (state: TState) => void;