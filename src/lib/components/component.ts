import { AnyAction, combineReducers, Dispatch, Reducer, ReducersMapObject, Store } from 'redux';
import { isComponentSchema, componentSchema } from './componentSchema';
import { getPrototype, getMethods } from 'lib/utils';

const COMPONENT_INITIAL_STATE = Symbol('COMPONENT_INITIAL_STATE');

export type IStateListener<TState> = (state: TState, action: AnyAction) => void;

export type UnsubscribeFunc = () => void;

export class Component<T> {

    private ownReducer: Reducer<T>;

    constructor(dispatch: Dispatch<T>, schema: any, throwOnEmpty = true) {
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

    private createSelf(dispatch: Dispatch<T>, schema: any): void {
        if (!isComponentSchema(schema))
            return;

        this.ownReducer = this.createReducer(schema, this.updateState.bind(this));
        Object.assign(getPrototype(this), this.createActions(dispatch, schema));
    }

    private createChildren(store: Dispatch<T>, schema: any): void {
        for (let key of Object.keys(schema)) {
            var subSchema = schema[key];
            if (isComponentSchema(subSchema)) {
                (this as any)[key] = new Component(store, subSchema, false);
            }
        }
    }

    private updateState(newState: T, action: AnyAction): void {

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
    }

    private createReducer(schema: any, listener?: IStateListener<T>): Reducer<T> {

        var methods = getMethods(schema);
        if (!methods || !Object.keys(methods).length)
            return undefined;

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

            // notify listener
            if (listener)
                listener(newState, action);

            // return new state
            return newState;
        };
    }

    private createActions(dispatch: Dispatch<T>, schema: any): any {

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