import { AnyAction, Dispatch, Reducer, Store } from 'redux';
import { IActionsMap } from './actions';
import { COMPONENT_INITIAL_STATE, ComponentSchema, ReducerCreator, COMPONENT_CREATOR } from './componentSchema';

export type IStateListener<TState> = (state: TState) => void;

export class Component<TState, TActions extends IActionsMap<TState>> {

    public reducer: Reducer<TState>;
    public actions: IActionsMap<TState>;
    public state: TState;

    constructor(dispatch: Dispatch<TState>, schema: ComponentSchema<TActions>) {
        this.reducer = this.createReducer(this.getReducerCreator(schema), this.updateState.bind(this));
        this.actions = this.createActions(dispatch, this.getActions(schema));
    }

    public getReducerCreator(schema: ComponentSchema<TActions>): ReducerCreator<TState, TActions> {

        // https://stackoverflow.com/questions/1833588/javascript-clone-a-function
        const creatorClone = (schema.constructor as any).actions.bind({});

        // ReducerCreators are just plain functions. That's why we decorate them to
        // distinguish them from other functions.
        (creatorClone as any)[COMPONENT_CREATOR] = true;
        // in addition we store some useful information for later
        (creatorClone as any)[COMPONENT_INITIAL_STATE] = () => Object.create(schema);

        return creatorClone;
    }

    private getActions(schema: ComponentSchema<TActions>): TActions {
        return this.getReducerCreator(schema)(undefined);
    }

    private updateState(newState: TState): void {
        this.state = newState;
    }

    private createActions<TState, TActions extends IActionsMap<TState>>(dispatch: Dispatch<TState>, actions: TActions): TActions {

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

    private createReducer<TState, TActions extends IActionsMap<TState>>(creator: ReducerCreator<TState, TActions>, listener?: IStateListener<TState>): Reducer<TState> {

        var reducersMap = creator(undefined);

        return (state: TState, action: AnyAction) => {

            if (state === undefined){
                var initial = (creator as any)[COMPONENT_INITIAL_STATE];
                console.log(initial);
                return initial();
            }

            // check if should use this reducer
            if (typeof reducersMap[action.type] !== 'function')
                return state;

            // create new reducer for the current state
            reducersMap = creator(state);
            var actionReducer = reducersMap[action.type];
            if (typeof actionReducer === 'function') {
                const newState = actionReducer(...action.payload);

                // notify listener
                if (listener)
                    listener(newState);

                // return new state
                return newState;
            }

            // no matching action
            return state;
        };
    }
}