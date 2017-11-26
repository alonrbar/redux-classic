import { Reducer, ReducersMapObject } from 'redux';
import { Computed, Connect, IgnoreState } from '../decorators';
import { ComponentInfo, CreatorInfo, getCreatorMethods } from '../info';
import { getActionName } from '../options';
import { IMap, Method } from '../types';
import { getMethods, isPrimitive, log, simpleCombineReducers, transformDeep, TransformOptions } from '../utils';
import { ReduxAppAction } from './actions';
import { Component } from './component';
var getProp = require('lodash.get');
var setProp = require('lodash.set');

// tslint:disable:member-ordering

export class ComponentReducer {

    private static readonly identityReducer = (state: any) => state;

    private static transformOptions: TransformOptions;

    //
    // public methods
    //

    public static createReducer(component: Component, creator: object): Reducer<object> {

        // method names lookup
        const methods = getCreatorMethods(creator);
        const creatorInfo = CreatorInfo.getInfo(creator);
        if (!creatorInfo)
            throw new Error(`Inconsistent component '${creator.constructor.name}'. The 'component' class decorator is missing.`);

        const options = creatorInfo.options;
        const methodNames: any = {};
        Object.keys(methods).forEach(methName => {
            var actionName = getActionName(creator, methName, options);
            methodNames[actionName] = methName;
        });

        // state object prototype
        const stateProto = ComponentReducer.createStateObjectPrototype(component, creatorInfo);

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
            const newState = ComponentReducer.createStateObject(state, stateProto);
            actionReducer.call(newState, ...action.payload);

            // return new state
            log.verbose('[reducer] Reducer invoked, returning new state');
            return newState;
        };
    }

    public static combineReducersTree(root: Component, components: IMap<Component>): Reducer<any> {

        // const reducer = ComponentReducer.combineReducersRecursion(root, new Set(), components);
        const reducer = ComponentReducer.newCombineReducers(root, components);

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
    // private methods - state object
    //

    /**
     * Create a "state object". The state object receives it's properties from
     * the current state and it's methods from the owning component. Methods
     * that represent actions are replace with a throw call, while noDispatch
     * methods are kept in place.
     */
    private static createStateObject(state: object, stateProto: object): object {
        const stateObj = Object.create(stateProto);
        Object.assign(stateObj, state);
        return stateObj;
    }

    /**
     * See description of 'createStateObject'.
     */
    private static createStateObjectPrototype(component: Component, creatorInfo: CreatorInfo): object {
        const stateProto: IMap<Method> = {};
        const componentMethods = getMethods(component);
        for (let key of Object.keys(componentMethods)) {
            if (creatorInfo.noDispatch[key]) {
                stateProto[key] = componentMethods[key].bind(component);
            } else {
                stateProto[key] = ComponentReducer.actionInvokedError;
            }
        }
        return stateProto;
    }

    private static actionInvokedError() {
        throw new Error("Only 'noDispatch' methods can be invoked inside actions.");
    }

    //
    // private methods - reducer
    //

    public static newCombineReducers(root: Component, components: IMap<Component>): Reducer<any> {
        return (state: object, action: ReduxAppAction) => {
            const newState = Object.assign({}, state);

            const componentPaths = Object.keys(components).sort();
            for (let curCompPath of componentPaths) {

                // get the component
                const curComponent = components[curCompPath];
                const curReducer = ComponentInfo.getInfo(curComponent).reducer;

                debugger;

                // get the old state
                const normalizedCompPath = ComponentReducer.normalizeComponentPath(curCompPath);
                const oldSubState = ComponentReducer.getOldSubState(state, normalizedCompPath);

                // reduce new state
                const newSubState = curReducer(oldSubState, action);
                if (oldSubState !== newSubState)
                    ComponentReducer.setNewSubState(newState, curCompPath, newSubState);
            }

            return newState;
        };
    }

    private static normalizeComponentPath(path: string): string {
        var normalizedPath = path.substr('root'.length);
        if (normalizedPath.startsWith('.'))
            normalizedPath = normalizedPath.substr(1);

        return normalizedPath;
    }

    private static getOldSubState(state: any, path: string): any {
        if (path === '')
            return state;

        return getProp(state, path);
    }

    private static setNewSubState(newState: any, path: string, newSubState: any): any {
        if (path === '')
            return newSubState;

        setProp(newState, path, newSubState);
        return newState;
    }

    public static combineReducersRecursion(obj: any, visited: Set<any>, components: IMap<Component>): Reducer<any> {

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
            var newSubReducer = ComponentReducer.combineReducersRecursion((obj as any)[key], visited, components);
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
                const combinedState = ComponentReducer.mergeState(thisState, subStates);

                return combinedState;
            };
        }

        return resultReducer;
    }

    private static mergeState(state: any, subStates: any): any {

        if (Array.isArray(state) && Array.isArray(subStates)) {

            // merge arrays
            for (let i = 0; i < subStates.length; i++)
                state[i] = subStates[i];
            return state;

        } else {

            // merge objects
            return {
                ...state,
                ...subStates
            };
        }
    }

    private static finalizeState(rootState: any, root: any): any {
        if (!ComponentReducer.transformOptions) {
            const options = new TransformOptions();
            options.propertyPreTransform = (target, source, key) => !Connect.isConnectedProperty(target, key);
            ComponentReducer.transformOptions = options;
        }

        return transformDeep(rootState, root, (subState, subObj) => {

            // replace computed and connected props with placeholders
            var newSubState = Computed.removeComputedProps(subState, subObj);
            newSubState = Connect.removeConnectedProps(newSubState, subObj);

            // removed props that should not be stored in the store
            newSubState = IgnoreState.removeIgnoredProps(newSubState, subObj);

            return newSubState;
        }, ComponentReducer.transformOptions);
    }
}