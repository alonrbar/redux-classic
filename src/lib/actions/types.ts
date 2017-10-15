
export type AutomatonAction<TState> = (...payload: any[]) => TState;

export interface IActionsMap<TState> {
    [actionName: string]: AutomatonAction<TState>;
}