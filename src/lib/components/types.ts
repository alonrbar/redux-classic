
//
// actions
//

export type ComponentAction<TState> = (...payload: any[]) => TState;

export interface IActionsMap<TState> {
    [actionName: string]: ComponentAction<TState>;
}

//
// reducers
//

export type ReducerCreator<TState, TActions extends IActionsMap<TState>> = (state: TState) => TActions;

export function isReducerCreator(obj: any): obj is ReducerCreator<any, any> {
    return typeof obj === 'function';
}

//
// state
//

export type IStateListener<TState> = (state: TState) => void;

//
// component schema
//

export interface ComponentSchema<TState, TActions extends IActionsMap<TState>> {
    actions: ReducerCreator<TState, TActions>;
}

export function isComponentSchema(obj: any): obj is ComponentSchema<any, any> {
    return obj.constructor && obj.constructor.actions && isReducerCreator(obj.constructor.actions);
}

export type IComponentSchemaTree = any;

export function isComponentSchemaTree(obj: any): obj is IComponentSchemaTree {
    return Object.keys(obj).length !== 0;
}