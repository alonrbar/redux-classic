import { AnyAction, combineReducers, Dispatch, Reducer, ReducersMapObject, Store } from 'redux';
import { isComponentSchema, componentSchema } from './componentSchema';
import { getPrototype, getMethods } from 'lib/utils';

const COMPONENT_INITIAL_STATE = Symbol('COMPONENT_INITIAL_STATE');

export type IStateListener<T> = (state: T, action: AnyAction) => void;

export type UnsubscribeFunc = () => void;

export class Component<T> {

    private ownReducer: Reducer<T>;

    constructor(dispatch: Dispatch<T>, schema: T) {
        
        if (!isComponentSchema(schema))
            throw new Error("Argument schema is not a component schema. Did you forget to use the decorator?");

        this.createSelf(dispatch, schema);
        this.createChildren(dispatch, schema);
    }

    public getReducer(): Reducer<T> {
        if (this.ownReducer) {
            return this.ownReducer;
        } else {
            const result: ReducersMapObject = {};
            for (let key of Object.keys(this)) {
                if ((this as any)[key] instanceof Component)
                    result[key] = (this as any)[key].getReducer();
            }
            return combineReducers(result);
        }
    }

    // public subscribe(): UnsubscribeFunc {

    // }

    private createSelf(dispatch: Dispatch<T>, schema: T): void {

        // regular js props
        for (let key of Object.keys(schema)) {
            (this as any)[key] = (schema as any)[key];
        }
        
        // reducer
        this.ownReducer = this.createReducer(schema);
        
        // actions
        Object.assign(getPrototype(this), this.createActions(dispatch, schema));
    }

    private createChildren(store: Dispatch<T>, schema: T): void {
        for (let key of Object.keys(schema)) {
            var subSchema = (schema as any)[key];
            if (isComponentSchema(subSchema)) {
                (this as any)[key] = new Component(store, subSchema);
            }
        }
    }

    private updateState(newState: T, action: AnyAction, notify: boolean): T {

        var self = (this as any);
        var anyState = (newState as any);

        var deleted = false;
        var assigned = false;

        // console.log('action: ', action)
        // console.log('before: ', JSON.stringify(this))

        // assign new state
        Object.keys(newState).forEach(key => {
            if (self[key] !== anyState[key]) {
                self[key] = anyState[key];
                assigned = true;
            }
        });

        // delete previous state (delete all non-functions)
        Object.keys(this).forEach(key => {
            if (typeof self[key] !== 'function') {
                if (anyState[key] === undefined) {
                    delete self[key];
                    deleted = true;
                }
            }
        })

        // console.log('after: ', JSON.stringify(this))
        // console.log('deleted: ', deleted)
        // console.log('assigned: ', assigned)

        return newState;
    }

    private createReducer(schema: T): Reducer<T> {

        var methods = getMethods(schema);
        if (!methods || !Object.keys(methods).length)
            return undefined;

        return (state: T, action: AnyAction) => {

            if (state === undefined)
                return this.updateState(schema, action, false);

            // check if should use this reducer            
            var actionReducer = methods[action.type];
            if (!actionReducer)
                return this.updateState(state, action, false);

            // call the action-reducer with the new state as the 'this' argument
            var newState = Object.assign({}, state);
            actionReducer.call(newState, ...action.payload);

            // return new state
            return this.updateState(newState, action, true);
        };
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
}