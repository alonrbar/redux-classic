import { Reducer, ReducersMapObject } from 'redux';
import { Computed, Connect, IgnoreState } from '../decorators';
import { ComponentInfo, CreatorInfo, getCreatorMethods } from '../info';
import { getActionName } from '../options';
import { IMap, Listener, Method } from '../types';
import { clearProperties, getMethods, isPrimitive, log, simpleCombineReducers } from '../utils';
import { ReduxAppAction } from './actions';
import { Component } from './component';
import { RecursionContext } from './recursionContext';

// tslint:disable:member-ordering

export type ReducerCreator = (changeListener: Listener<Component>) => Reducer<object>;

export class CombineReducersContext extends RecursionContext {

    public componentPaths: string[] = [];
    public changedComponents: IMap<Component> = {};

    constructor(initial?: Partial<CombineReducersContext>) {
        super();

        Object.assign(this, initial);
    }
}

export class ComponentReducer {

    private static readonly identityReducer = (state: any) => state;

    //
    // public methods
    //

    public static createReducer(component: Component, componentCreator: object): ReducerCreator {

        // method names lookup
        const methods = getCreatorMethods(componentCreator);
        const creatorInfo = CreatorInfo.getInfo(componentCreator);
        if (!creatorInfo)
            throw new Error(`Inconsistent component '${componentCreator.constructor.name}'. The 'component' class decorator is missing.`);

        const options = creatorInfo.options;
        const methodNames: any = {};
        Object.keys(methods).forEach(methName => {
            var actionName = getActionName(componentCreator, methName, options);
            methodNames[actionName] = methName;
        });

        // state object prototype
        const stateProto = ComponentReducer.createStateObjectPrototype(component, creatorInfo);

        // component id
        const componentId = ComponentInfo.getInfo(component).id;

        // the reducer
        return (changeListener: Listener<Component>) => {

            return (state: object, action: ReduxAppAction) => {

                log.verbose(`[reducer] Reducer of: ${componentCreator.constructor.name}, action: ${action.type}`);

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

                // notify changes
                changeListener(component);

                // return new state                
                log.verbose('[reducer] Reducer invoked, returning new state');
                return newState;
            };
        };
    }

    public static combineReducersTree(root: Component, componentPaths: string[], changedComponents: IMap<Component>): Reducer<any> {

        const context = new CombineReducersContext({
            componentPaths,
            changedComponents
        });
        const reducer = ComponentReducer.combineReducersRecursion(root, context);

        return (state: any, action: ReduxAppAction) => {
            const start = Date.now();

            // clear previous change records
            clearProperties(changedComponents);

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
    // private methods - combine reducers
    //

    private static combineReducersRecursion(obj: any, context: CombineReducersContext): Reducer<any> {

        // no need to search inside primitives
        if (isPrimitive(obj))
            return undefined;

        // prevent endless loops on circular references
        if (context.visited.has(obj))
            return undefined;
        context.visited.add(obj);

        // ignore branches with no descendant components
        if (!context.componentPaths.some(path => path.startsWith(context.path)))
            return ComponentReducer.identityReducer;

        // get the root reducer
        var rootReducer: Reducer<any>;
        const info = ComponentInfo.getInfo(obj as any);
        if (info) {
            rootReducer = info.reducerCreator(comp => {
                context.changedComponents[context.path] = comp;
            });
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
            var newSubReducer = ComponentReducer.combineReducersRecursion((obj as any)[key], {
                ...context,
                path: (context.path === '' ? key : context.path + '.' + key)
            });
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

    private static finalizeState(rootState: any, root: Component): any {
        return ComponentReducer.finalizeStateRecursion(rootState, root, new Set());
    }

    private static finalizeStateRecursion(state: any, obj: any, visited: Set<any>): any {

        // primitive properties are updated by their owner objects
        if (isPrimitive(state) || isPrimitive(obj))
            return state;

        // prevent endless loops on circular references
        if (visited.has(state))
            return state;
        visited.add(state);

        const handledProps = {};
        state = Connect.removeConnectedProps(state, obj, handledProps);
        state = Computed.removeComputedProps(state, obj, handledProps);
        state = IgnoreState.removeIgnoredProps(state, obj, handledProps);

        // transform children
        Object.keys(state).forEach(key => {

            // skip already handled properties
            if (handledProps.hasOwnProperty(key))
                return;

            var subState = state[key];
            var subObj = obj[key];
            var newSubState = ComponentReducer.finalizeStateRecursion(subState, subObj, visited);

            // assign only if changed
            if (newSubState !== subState) {
                state[key] = newSubState;
            }
        });

        return state;
    }
}