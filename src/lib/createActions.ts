import { Dispatch } from 'redux';
import { ReducerCreator, IActionsMap } from './types';

export function createActions<TState, TActions extends IActionsMap<TState>>(dispatch: Dispatch<TState>, actions: TActions): TActions {

    console.warn('createActions');

    if (!Object.keys(actions).length)
        throw new Error("Argument 'actions' expected to have at least one action.");

    var outputActions: TActions;
    (outputActions as any) = {};
    Object.keys(actions).forEach(actionName => {
        outputActions[actionName] = (...payload: any[]) => {
            dispatch({
                type: actionName,
                payload: payload
            });
            return undefined;
        };
    });

    return outputActions;
}