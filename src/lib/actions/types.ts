
export type ComponentAction<TState> = (...payload: any[]) => TState;

export interface IActionsMap<TState> {
    [actionName: string]: ComponentAction<TState>;
}