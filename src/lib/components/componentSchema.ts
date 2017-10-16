import { IActionsMap } from "./actions";

export const COMPONENT_CREATOR = Symbol('COMPONENT_CREATOR');
export const COMPONENT_INITIAL_STATE = Symbol('COMPONENT_INITIAL_STATE');

export type ReducerCreator<TState, TActions extends IActionsMap<TState>> = (state: TState) => TActions;

export interface IComponentSchemaTree {
    [key: string]: ComponentSchema<any, any> | IComponentSchemaTree;
}

export class ComponentSchema<TState, TActions extends IActionsMap<TState>> {

    private readonly initialStateFactory: () => TState
    private readonly reducerCreator: ReducerCreator<TState, TActions>;

    constructor(initialStateFactory: () => TState, creator: ReducerCreator<TState, TActions>) {
        this.initialStateFactory = initialStateFactory;
        this.reducerCreator = creator;
    }

    public getReducerCreator(): ReducerCreator<TState, TActions> {
        // https://stackoverflow.com/questions/1833588/javascript-clone-a-function
        const creatorClone = this.reducerCreator.bind({});

        // ReducerCreators are just plain functions. That's why we decorate them to
        // distinguish them from other functions.
        (creatorClone as any)[COMPONENT_CREATOR] = true;
        // in addition we store some useful information for later
        (creatorClone as any)[COMPONENT_INITIAL_STATE] = this.initialStateFactory();

        return creatorClone;
    }

    public getActions(): TActions {
        return this.reducerCreator(undefined);
    }
}