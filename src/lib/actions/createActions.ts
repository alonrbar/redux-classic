import { Dispatch } from 'redux';
import { IActionsMap } from './types';

export function createActions<TState, TActions extends IActionsMap<TState>>(dispatch: Dispatch<TState>, actions: TActions): TActions {

    if (!Object.keys(actions).length)
        console.warn("Argument 'actions' expected to have at least one action but have none.");

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