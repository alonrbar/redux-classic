import { AnyAction, combineReducers, Dispatch, Reducer, ReducersMapObject, Store } from 'redux';
import { ComponentSchema, IActionsMap, IComponentSchemaTree, isComponentSchema, isComponentSchemaTree, ReducerCreator, IStateListener } from './types';

export type ComponentKeys<TState> = (keyof TState) | 'actions' | 'state';

export type TypedComponent<TState, TActions> = IComponent<TState, TActions> & TState;

export interface IComponent<TState, TActions> {
    actions: TActions;
    state: TState;
    getReducer(): Reducer<any>;
    getStateDeep(): TState;
}

const COMPONENT_INITIAL_STATE = Symbol('COMPONENT_INITIAL_STATE');

export class Component<TState, TActions extends IActionsMap<TState>> implements IComponent<TState, TActions> {

    public actions: TActions;
    public state: TState;
    [subComponentName: string]: Component<any, any> | any;

    private ownReducer: Reducer<TState>;

    constructor(dispatch: Dispatch<TState>, schema: IComponentSchemaTree, throwOnEmpty = true) {

        if (isComponentSchema(schema)) {
            this.createSelf(dispatch, schema);
        } else if (isComponentSchemaTree(schema)) {
            this.createChildren(dispatch, schema);
        }

        if (Object.keys(this).every(key => this[key] === 'undefined')) {
            if (throwOnEmpty) {
                throw new Error(`Invalid ${nameof(schema)}. Could not c ${nameof(Component)} initialization failed.`)
            } else {
                return undefined;
            }
        }
    }

    public getReducer(): Reducer<any> {
        if (this.ownReducer) {
            return this.ownReducer;
        } else {
            const result: ReducersMapObject = {};
            for (let key of Object.keys(this)) {
                if (this[key] instanceof Component)
                    result[key] = this[key].getReducer();
            }
            return combineReducers(result);
        }
    }

    public getStateDeep(): TState {

        var selfState: any = {};
        if (this.component)
            selfState = this.component.state;

        var childrenState: any = {};
        for (let key of Object.keys(this)) {
            if (this[key] instanceof Component)
                childrenState[key] = this[key].getStateDeep();
        }

        return {
            ...selfState,
            ...childrenState
        };
    }

    private createSelf(dispatch: Dispatch<TState>, schema: ComponentSchema<TState, TActions>): void {
        this.ownReducer = this.createReducer(this.getReducerCreator(schema), this.updateState.bind(this));
        this.actions = this.createActions(dispatch, this.getActions(schema));
    }

    private createChildren(store: Dispatch<TState>, schema: IComponentSchemaTree): void {
        for (let key of Object.keys(schema)) {
            this[key] = new Component(store, schema[key] as IComponentSchemaTree, false);
        }
    }

    private getReducerCreator(schema: ComponentSchema<TState, TActions>): ReducerCreator<TState, TActions> {

        // https://stackoverflow.com/questions/1833588/javascript-clone-a-function
        const creatorClone = (schema.constructor as any).actions.bind({});

        // ReducerCreators are just plain functions. That's why we decorate them to
        // distinguish them from other functions.
        // (creatorClone as any)[COMPONENT_CREATOR] = true;
        // in addition we store some useful information for later
        (creatorClone as any)[COMPONENT_INITIAL_STATE] = () => Object.create(schema);

        return creatorClone;
    }

    private getActions(schema: ComponentSchema<TState, TActions>): TActions {
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

            if (state === undefined)
                return (creator as any)[COMPONENT_INITIAL_STATE]();

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