import { Reducer, ReducersMapObject } from 'redux';
import { Computed, Connect } from '../decorators';
import { ComponentInfo, CreatorInfo, getCreatorMethods } from '../info';
import { getActionName } from '../options';
import { isPrimitive, log, simpleCombineReducers } from '../utils';
import { ReduxAppAction } from './actions';
import { Component } from './component';

type StateTransformer = (state: any, obj: any) => any;

// tslint:disable:member-ordering

export class ComponentReducer {

    private static readonly identityReducer = (state: any) => state;

    //
    // public methods
    //

    public static createReducer(component: Component, creator: object): Reducer<object> {

        // method names lookup
        const methods = getCreatorMethods(creator);
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

            // initial state (redundant, handled in 'prepareState')
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

    public static combineReducersTree(root: any): Reducer<any> {

        const reducer = ComponentReducer.combineReducersRecursion(root, new Set());

        return (state: any, action: ReduxAppAction) => {
            const start = Date.now();

            var newState = reducer(state, action);
            newState = ComponentReducer.finalizeState(newState, root);

            const end = Date.now();
            log.debug(`[rootReducer] Reducer tree processed in ${end - start}ms.`);

            return newState;
        };
    }

    //
    // private methods
    //

    private static combineReducersRecursion(obj: any, visited: Set<any>): Reducer<any> {

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

            // connected components are modified only by their source
            if (Connect.isConnectedProperty(obj, key))
                continue;

            // other objects
            var newSubReducer = ComponentReducer.combineReducersRecursion((obj as any)[key], visited);
            if (typeof newSubReducer === 'function')
                subReducers[key] = newSubReducer;
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

        return resultReducer;
    }    

    private static finalizeState(rootState: any, root: any): any {
        return ComponentReducer.transformDeep(rootState, root, (subState, subObj) => {

            // replace computed and connected props with placeholders
            var newSubState = Computed.removeComputedProps(subState, subObj);
            newSubState = Connect.removeConnectedProps(newSubState, subObj);

            return newSubState;
        }, new Set());
    }

    private static transformDeep(target: any, source: any, callback: StateTransformer, visited: Set<any>): any {

        // not traversing primitives
        if (isPrimitive(target) || isPrimitive(source))
            return target;

        // prevent endless loops on circular references
        if (visited.has(source))
            return source;
        visited.add(source);

        // transform children
        Object.keys(target).forEach(key => {

            // state of connected components is update on their source
            if (Connect.isConnectedProperty(source, key))
                return;

            // transform child
            var subState = target[key];
            var subObj = source[key];
            var newSubState = ComponentReducer.transformDeep(subState, subObj, callback, visited);

            // assign only if changed
            if (newSubState !== subState) {
                target[key] = newSubState;
            }
        });

        // invoke on self
        return callback(target, source);
    }
}