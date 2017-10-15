import { Dispatch, Reducer, Store } from 'redux';
import { createActions, IActionsMap } from '../actions';
import { AutomatonCreator } from '../automata';
import { createReducer } from '../reducers';

export class Automaton<TState, TActions extends IActionsMap<TState>> {

    public reducer: Reducer<TState>;
    public actions: IActionsMap<TState>;
    public state: TState;

    constructor(store: Store<TState>, creator: AutomatonCreator<TState, TActions>);
    constructor(dispatch: Dispatch<TState>, creator: AutomatonCreator<TState, TActions>); // tslint:disable-line:unified-signatures
    constructor(storeOrDispatch: Store<TState> | Dispatch<TState>, creator: AutomatonCreator<TState, TActions>) {
        
        var dispatch = (storeOrDispatch as any).dispatch || storeOrDispatch;

        this.reducer = createReducer(creator, this.updateState.bind(this));
        this.actions = createActions(dispatch, creator(undefined));
    }

    private updateState(newState: TState): void {
        this.state = newState;
    }
}