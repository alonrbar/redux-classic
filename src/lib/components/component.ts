import { Dispatch, Reducer, Store } from 'redux';
import { createActions, IActionsMap } from '../actions';
import { createReducer } from '../reducers';
import { ComponentCreator } from './componentCreator';

export class Component<TState, TActions extends IActionsMap<TState>> {

    public reducer: Reducer<TState>;
    public actions: IActionsMap<TState>;
    public state: TState;

    constructor(store: Store<TState>, creator: ComponentCreator<TState, TActions>);
    constructor(dispatch: Dispatch<TState>, creator: ComponentCreator<TState, TActions>); // tslint:disable-line:unified-signatures
    constructor(storeOrDispatch: Store<TState> | Dispatch<TState>, creator: ComponentCreator<TState, TActions>) {
        
        var dispatch = (storeOrDispatch as any).dispatch || storeOrDispatch;

        this.reducer = createReducer(creator, this.updateState.bind(this));
        this.actions = createActions(dispatch, creator(undefined));
    }

    private updateState(newState: TState): void {
        this.state = newState;
    }
}