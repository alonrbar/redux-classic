import { IActionsMap } from "../actions";

export type ReducerCreator<TState, TActions extends IActionsMap<TState>> = (state: TState) => TActions;

export type IStateListener<TState> = (state: TState) => void;
