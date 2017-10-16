import { ReducerCreator } from "../reducers";
import { IActionsMap } from "../actions";

export const COMPONENT_CREATOR = Symbol('COMPONENT_CREATOR');
export const COMPONENT_INITIAL_STATE = Symbol('COMPONENT_INITIAL_STATE');

export type ComponentCreator<TState, TActions extends IActionsMap<TState>> = ReducerCreator<TState, TActions>;

export interface ICreatorsMap {
    [key: string]: ComponentCreator<any, any> | ICreatorsMap;
}

export function componentCreator<TState, TActions extends IActionsMap<TState>>(initialState: () => TState, creator: ReducerCreator<TState, TActions>): () => ComponentCreator<TState, TActions> {
    return () => {

        // https://stackoverflow.com/questions/1833588/javascript-clone-a-function
        const creatorClone = creator.bind({});

        // ReducerCreators are just plain functions. That's why we decorate them to
        // distinguish them from other functions.
        (creatorClone as any)[COMPONENT_CREATOR] = true;
        // in addition we store some useful information for later
        (creatorClone as any)[COMPONENT_INITIAL_STATE] = initialState();

        return creatorClone;
    }
}