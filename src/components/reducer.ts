import { Reducer, ReducersMapObject } from 'redux';
import { Computed, Connect } from '../decorators';
import { ComponentInfo, CreatorInfo } from '../info';
import { getActionName } from '../options';
import { getMethods, isPrimitive, log, simpleCombineReducers } from '../utils';
import { ReduxAppAction } from './actions';
import { Component } from './component';

// tslint:disable:member-ordering

export class ComponentReducer {

    private static readonly identityReducer = (state: any) => state;

    public static createReducer(component: Component, creator: object): Reducer<object> {

        // method names lookup
        const methods = getMethods(creator);
        const options = CreatorInfo.getInfo(creator).options;
        const methodNames: any = {};
        Object.keys(methods).forEach(methName => {
            var actionName = getActionName(creator, methName, options);
            methodNames[actionName] = methName;
        });

        // component id
        const componentId = ComponentInfo.getInfo(component).id;

        // the reducer
        return (state: object, action: ReduxAppAction) => {

            log.verbose(`[reducer] Reducer of: ${creator.constructor.name}, action: ${action.type}`);

            // initial state
            if (state === undefined) {
                log.verbose('[reducer] State is undefined, returning initial value');
                return component;
            }

            // check component id
            if (componentId !== action.id) {
                log.verbose(`[reducer] Component id and action.id don't match (${componentId} !== ${action.id})`);
                return state;
            }

            // check if should use this reducer
            const methodName = methodNames[action.type];
            const actionReducer = methods[methodName];
            if (!actionReducer) {
                log.verbose('[reducer] No matching action in this reducer, returning previous state');
                return state;
            }

            // call the action-reducer with the new state as the 'this' argument
            var newState = Object.assign({}, state);
            actionReducer.call(newState, ...action.payload);

            // return new state
            log.verbose('[reducer] Reducer invoked, returning new state');
            return newState;
        };
    }

    public static getReducerFromTree(obj: any, visited: Set<any> = new Set()): Reducer<any> {

        // no need to search inside primitives
        if (isPrimitive(obj))
            return undefined;

        // prevent endless loops on circular references
        if (visited.has(obj))
            return undefined;
        visited.add(obj);

        // get the root reducer
        var rootReducer: Reducer<any>;
        const info = ComponentInfo.getInfo(obj as any);
        if (info) {
            rootReducer = info.reducer;
        } else {
            rootReducer = ComponentReducer.identityReducer;
        }

        // gather the sub-reducers
        const subReducers: ReducersMapObject = {};
        for (let key of Object.keys(obj)) {

            if (Connect.isConnectedProperty(obj, key)) {

                // connected components
                subReducers[key] = Connect.connectReducer;

            } else {

                // other objects
                var newSubReducer = ComponentReducer.getReducerFromTree((obj as any)[key], visited);
                if (typeof newSubReducer === 'function')
                    subReducers[key] = newSubReducer;
            }
        }

        var resultReducer = rootReducer;

        // combine reducers
        if (Object.keys(subReducers).length) {
            var combinedSubReducer = simpleCombineReducers(subReducers);

            resultReducer = (state: object, action: ReduxAppAction) => {

                const thisState = rootReducer(state, action);
                const subStates = combinedSubReducer(thisState, action);

                // merge self and sub states
                var combinedState = {
                    ...thisState,
                    ...subStates
                };

                return combinedState;
            };
        }

        return Computed.wrapReducer(resultReducer, obj);
    }
}