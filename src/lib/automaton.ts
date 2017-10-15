import { IActionsMap, ReducerCreator } from "./types";
import { Store, Reducer, Dispatch } from "redux";
import { createReducer } from "./createReducer";
import { createActions } from "./createActions";

export class Automaton<TState, TActions extends IActionsMap<TState>> {

    public reducer: Reducer<TState>;
    public actions: IActionsMap<TState>;
    public state: TState;

    constructor(store: Store<TState>, creator: ReducerCreator<TState, TActions>);
    constructor(dispatch: Dispatch<TState>, creator: ReducerCreator<TState, TActions>); // tslint:disable-line:unified-signatures
    constructor(storeOrDispatch: Store<TState> | Dispatch<TState>, creator: ReducerCreator<TState, TActions>) {
        
        var dispatch = (storeOrDispatch as any).dispatch || storeOrDispatch;

        this.reducer = createReducer(creator, this.updateState.bind(this));
        this.actions = createActions(dispatch, creator(undefined));
    }

    private updateState(newState: TState): void {
        this.state = newState;
    }
}