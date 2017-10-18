import { AnyAction, combineReducers, Dispatch, Reducer, ReducersMapObject, Store } from 'redux';
import { componentSchema, isComponentSchema } from './componentSchema';
import { getMethods, getProp, getPrototype } from './utils';

const REDUCER = Symbol('REDUCER')

export type IStateListener<T> = (state: T, action: AnyAction) => void;

export type UnsubscribeFunc = () => void;

export class Component<T> {

    constructor(store: Store<T>, schema: T, path: string[]) {

        if (!isComponentSchema(schema))
            throw new Error("Argument schema is not a component schema. Did you forget to use the decorator?");

        this.createSelf(store, schema, path);
        this.createSubComponents(store, schema, path);
    }

    public getReducer(): Reducer<T> {
        var thisReducer = (this as any)[REDUCER];

        const subReducers: ReducersMapObject = {};
        for (let key of Object.keys(this)) {
            if ((this as any)[key] instanceof Component)
                subReducers[key] = (this as any)[key].getReducer();
        }

        // reducer with sub-reducers
        if (Object.keys(subReducers).length) {

            var combinedSubReducer = combineReducers<any>(subReducers);
            
            return (state: T, action: AnyAction) => {
                const thisState = thisReducer(state, action);
                const subStates = combinedSubReducer(state, action);

                // merge self and sub states
                return {
                    ...thisState,
                    ...subStates
                }
            }
        }

        // single reducer
        return thisReducer;
    }

    // public subscribe(): UnsubscribeFunc {

    // }

    private createSelf(store: Store<T>, schema: T, path: string[]): void {

        // regular js props
        for (let key of Object.keys(schema)) {
            (this as any)[key] = (schema as any)[key];
        }

        // actions
        var proto = getPrototype(this);
        var patchedProto = this.createActions(store.dispatch, schema);
        Object.assign(proto, patchedProto);

        // reducer
        (this as any)[REDUCER] = this.createReducer(schema);

        // state
        store.subscribe(() => this.updateState(store.getState(), path))
    }

    private createSubComponents(store: Store<T>, schema: T, path: string[]): void {
        for (let key of Object.keys(schema)) {
            var subSchema = (schema as any)[key];
            if (isComponentSchema(subSchema)) {
                (this as any)[key] = new Component(store, subSchema, path.concat([key]));
            }
        }
    }

    private createActions(dispatch: Dispatch<T>, schema: T): any {

        var methods = getMethods(schema);
        if (!methods)
            return undefined;

        var outputActions: any = {};
        Object.keys(methods).forEach(key => {
            outputActions[key] = (...payload: any[]): void => {
                dispatch({
                    type: key,
                    payload: payload
                });
            };
        });

        return outputActions;
    }

    private createReducer(schema: T): Reducer<T> {

        var methods = getMethods(schema);

        return (state: T, action: AnyAction) => {

            if (state === undefined)
                return schema;

            // check if should use this reducer            
            var actionReducer = methods[action.type];
            if (!actionReducer)
                return state;

            // call the action-reducer with the new state as the 'this' argument
            var newState = Object.assign({}, state);
            actionReducer.call(newState, ...action.payload);

            // return new state
            return newState;
        };
    }

    private updateState(newGlobalState: T, path: string[]): void {

        // console.log(path)

        var self = (this as any);
        var newScopedState = getProp(newGlobalState, path);

        var deleted = false;
        var assigned = false;

        // console.log('store before: ', newScopedState)
        // console.log('this before: ', this)

        // assign new state
        Object.keys(newScopedState).forEach(key => {
            // We check two things:
            // 1. The new value is not referencely equal to the previous. This
            //    is just a minor optimization.
            // 2. The old value isn't a component. Overwriting a component means
            //    losing it's patched prototype and therefore invoking it's
            //    methods will not use the store's dispatch function anymore.            
            if (self[key] !== newScopedState[key] && !(self[key] instanceof Component)) {
                self[key] = newScopedState[key];
                assigned = true;
            }
        });

        // delete left-overs from previous state
        Object.keys(this).forEach(key => {
            if (newScopedState[key] === undefined) {
                delete self[key];
                deleted = true;
            }
        })

        // console.log('store after: ', newScopedState)
        // console.log('this after: ', this)
        // console.log('deleted: ', deleted)
        // console.log('assigned: ', assigned)
    }
}