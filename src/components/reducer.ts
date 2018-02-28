import { Reducer, ReducersMapObject } from 'redux';
import { IgnoreState } from '../decorators';
import { ComponentInfo, CreatorInfo, getCreatorMethods } from '../info';
import { ROOT_COMPONENT_PATH } from '../reduxApp';
import { IMap, Listener, Method } from '../types';
import { clearProperties, getMethods, isPlainObject, isPrimitive, log, simpleCombineReducers } from '../utils';
import { ComponentActions, ReduxAppAction } from './actions';
import { Component } from './component';

// tslint:disable:member-ordering ban-types

export type ReducerCreator = (changeListener: Listener<Component>) => Reducer<object>;

export class CombineReducersContext {

    public visited = new Set();
    public path = ROOT_COMPONENT_PATH;
    public componentPaths: string[] = [];
    public changedComponents: IMap<Component> = {};
    public invoked = false;

    constructor(initial?: Partial<CombineReducersContext>) {
        Object.assign(this, initial);
    }

    public reset(): void {
        clearProperties(this.changedComponents);
        this.invoked = false;
    }
}

export class ComponentReducer {

    private static readonly identityReducer = (state: any) => state;

    //
    // public methods
    //

    public static createReducer(component: Component, componentCreator: object): ReducerCreator {

        const creatorInfo = CreatorInfo.getInfo(componentCreator);
        if (!creatorInfo)
            throw new Error(`Inconsistent component '${componentCreator.constructor.name}'. The 'component' class decorator is missing.`);

        const methods = ComponentReducer.createMethodsLookup(componentCreator, creatorInfo);
        const stateProto = ComponentReducer.createStateObjectPrototype(component, creatorInfo);
        const componentId = ComponentInfo.getInfo(component).id;
        
        return (changeListener: Listener<Component>) => {

            // the reducer
            function reducer(state: object, action: ReduxAppAction) {

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
                const actionReducer = methods[action.type];
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
            }

            // reducer wrapper
            return (state: object, action: ReduxAppAction) => {
                let newState = reducer(state, action);
                if (!isPrimitive(newState) && !isPlainObject(newState)) {
                    newState = ComponentReducer.finalizeStateObject(newState, component);
                }
                return newState;
            };
        };
    }

    public static combineReducersTree(root: Component, context: CombineReducersContext): Reducer<any> {

        const reducer = ComponentReducer.combineReducersRecursion(root, context);

        return (state: any, action: ReduxAppAction) => {
            const start = Date.now();

            context.invoked = true;
            log.debug(`[rootReducer] Reducing action: ${action.type}.`);

            const newState = reducer(state, action);

            const end = Date.now();
            log.debug(`[rootReducer] Reducer tree processed in ${end - start}ms.`);

            return newState;
        };
    }

    //
    // private methods - state object
    //
    
    private static createMethodsLookup(componentCreator: object, creatorInfo: CreatorInfo): IMap<Function> {
        
        const allMethods = getCreatorMethods(componentCreator);        

        const actionMethods: IMap<Function> = {};
        Object.keys(creatorInfo.actions).forEach(originalActionName => {
            const normalizedActionName = ComponentActions.getActionName(componentCreator, originalActionName);
            actionMethods[normalizedActionName] = allMethods[originalActionName];
        });

        return actionMethods;
    }

    /**
     * See description of 'createStateObject'.
     */
    private static createStateObjectPrototype(component: Component, creatorInfo: CreatorInfo): object {
        const stateProto: IMap<Method> = {};
        const componentMethods = getMethods(component);
        for (let key of Object.keys(componentMethods)) {
            if (!creatorInfo.actions[key]) {
                // regular method
                stateProto[key] = componentMethods[key].bind(component);
            } else {
                // action
                stateProto[key] = ComponentReducer.actionInvokedError;
            }
        }
        return stateProto;
    }

    private static actionInvokedError() {
        throw new Error("Only 'noDispatch' methods can be invoked inside actions.");
    }

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

    private static finalizeStateObject(state: object, component: Component): object {

        log.verbose('[finalizeStateObject] finalizing state.');
        let finalizedState = Object.assign({}, state);

        const handledProps = {};
        finalizedState = IgnoreState.removeIgnoredProps(finalizedState, component, handledProps);

        log.verbose('[finalizeStateObject] state finalized.');
        return finalizedState;
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
        let rootReducer: Reducer<any>;
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

            // other objects
            const newSubReducer = ComponentReducer.combineReducersRecursion((obj as any)[key], new CombineReducersContext({
                ...context,
                path: (context.path === '' ? key : context.path + '.' + key)
            }));
            if (typeof newSubReducer === 'function')
                subReducers[key] = newSubReducer;
        }

        let resultReducer = rootReducer;

        // combine reducers
        if (Object.keys(subReducers).length) {
            const combinedSubReducer = simpleCombineReducers(subReducers);

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
}