import { AnyAction, Dispatch, Reducer, ReducersMapObject, Store } from 'redux';
import { getComponentId } from '../decorators';
import { getActionName, getSchemaOptions } from '../options';
import { COMPONENT_ID, DISPOSE, getSymbol, NO_DISPATCH, REDUCER, setSymbol } from '../symbols';
import { getMethods, getProp, getPrototype, isPrimitive, log, simpleCombineReducers } from '../utils';
import { isComponentSchema } from './componentSchema';

// TODO: export type IStateListener<T> = (state: T) => void;
// TODO: add listensTo option

export class Component<T extends object> {

    constructor(store: Store<T>, schema: T, parent?: object, path: string[] = [], visited = new Set()) {

        if (!isComponentSchema(schema))
            throw new Error(`Argument '${nameof(schema)}' is not a component schema. Did you forget to use the decorator?`);

        createSelf(this, store, schema, parent, path);
        createSubComponents(this, store, schema, path, visited);

        log.debug(`[Component] new ${schema.constructor.name} component created. path: root.${path.join('.')}`);
    }

    public disposeComponent(): void {
        const disposables: any[] = getSymbol(this, DISPOSE);
        while (disposables.length) {
            var disposable = disposables.pop();
            if (disposable && disposable.dispose)
                disposable.dispose();
        }
    }
}

// 
// private methods are held outside of the component class to reduce the chance
// of method name collision.
//

function createSelf<T extends object>(component: Component<T>, store: Store<T>, schema: T, parent: any, path: string[]): void {

    setSymbol(component, DISPOSE, []);

    // assign ID
    const componentId = getComponentId(parent, path);
    if (componentId !== undefined && componentId !== null) {
        setSymbol(component, COMPONENT_ID, componentId);
    }

    // regular js props
    for (let key of Object.keys(schema)) {
        (component as any)[key] = (schema as any)[key];
    }

    // actions
    const proto = getPrototype(component);
    const patchedProto = createActions(store.dispatch, schema);
    Object.assign(proto, patchedProto);

    // reducer
    setSymbol(component, REDUCER, createReducer(component, schema));

    // state
    const options = getSchemaOptions(schema);
    if (options.updateState) {
        const unsubscribe = store.subscribe(() => updateState(component, store.getState(), path));
        getSymbol(component, DISPOSE).push({ dispose: () => unsubscribe() });
    }
}

function createSubComponents(obj: any, store: Store<object>, schema: object, path: string[], visited: Set<any>): void {

    // prevent endless loops on circular references
    if (visited.has(obj))
        return;
    visited.add(obj);

    const searchIn = schema || obj;

    // no need to search for components inside primitives
    if (isPrimitive(obj))
        return;

    // search for sub-components
    for (let key of Object.keys(searchIn)) {
        var subSchema = searchIn[key];
        var subPath = path.concat([key]);
        if (isComponentSchema(subSchema)) {
            obj[key] = new Component(store, subSchema, schema, subPath, visited);
        } else {
            createSubComponents(obj[key], store, null, subPath, visited);
        }
    }
}

function createActions(dispatch: Dispatch<object>, schema: object): any {

    const methods = getMethods(schema);
    if (!methods)
        return undefined;

    const outputActions: any = {};
    Object.keys(methods).forEach(key => {
        outputActions[key] = function (this: Component<object>, ...payload: any[]): void {

            // verify 'this' arg
            if (!(this instanceof Component)) {
                const msg = "Component method invoked with non-Component as 'this'. " +
                    "Some redux-app features such as the withId decorator will not work. Bound 'this' argument is: ";
                log.warn(msg, this);
            }

            const oldMethod = methods[key];
            if (getSymbol(oldMethod, NO_DISPATCH)) {

                // handle non-dispatch methods (just call the function)
                oldMethod.call(this, ...payload);
            } else {

                // handle dispatch methods (use store dispatch)
                dispatch({
                    type: getActionName(key, schema),
                    id: getSymbol(this, COMPONENT_ID),
                    payload: payload
                });
            }
        };
    });

    return outputActions;
}

function createReducer(component: Component<object>, schema: object): Reducer<object> {

    // method names lookup
    const methods = getMethods(schema);
    const methodNames: any = {};
    Object.keys(methods).forEach(methName => {
        var actionName = getActionName(methName, schema);
        methodNames[actionName] = methName;
    });

    // component id
    const componentId = getSymbol(component, COMPONENT_ID);

    // the reducer
    return (state: object, action: AnyAction) => {

        log.verbose(`[reducer] reducer of: ${schema.constructor.name}, action: ${action.type}`);

        // initial state
        if (state === undefined) {
            log.verbose('[reducer] state is undefined, returning initial value');
            return schema;
        }

        // check component id
        if (componentId !== action.id) {
            log.verbose(`[reducer] component id and action.id don't match (${componentId} !== ${action.id})`);
            return state;
        }

        // check if should use this reducer
        const methodName = methodNames[action.type];
        const actionReducer = methods[methodName];
        if (!actionReducer) {
            log.verbose('[reducer] no matching action in this reducer, returning previous state');
            return state;
        }

        // call the action-reducer with the new state as the 'this' argument        
        var newState = Object.assign({}, state);
        actionReducer.call(newState, ...action.payload);

        // return new state
        log.verbose('[reducer] reducer invoked, returning new state');
        return newState;
    };
}

const identityReducer = (state: any) => state;

export function getReducerFromTree(obj: object, path: string[] = [], visited: Set<any> = new Set()): Reducer<any> {

    // prevent endless loops on circular references
    if (visited.has(obj))
        return undefined;
    visited.add(obj);

    // no need to search inside primitives
    if (isPrimitive(obj))
        return undefined;
        
    // get the root reducer
    const rootReducer = getSymbol(obj, REDUCER) || identityReducer;

    // gather the sub-reducers
    const subReducers: ReducersMapObject = {};
    for (let key of Object.keys(obj)) {
        var newSubReducer = getReducerFromTree((obj as any)[key], path.concat(key), visited);
        if (typeof newSubReducer === 'function')
            subReducers[key] = newSubReducer;
    }

    // with sub-reducers
    if (Object.keys(subReducers).length) {

        var combinedSubReducer = simpleCombineReducers(subReducers);

        return (state: object, action: AnyAction) => {
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

    // without sub-reducers
    return rootReducer;
}

function updateState(component: Component<object>, newGlobalState: object, path: string[]): void {

    // vars
    var self = (component as any);
    var newScopedState = getProp(newGlobalState, path);

    // log
    log.verbose('[updateState] updating component in path: ', path.join('.'));
    log.verbose('[updateState] store before: ', newScopedState);
    log.verbose('[updateState] component before: ', component);

    // assign new state
    var propsAssigned: string[] = [];
    Object.keys(newScopedState).forEach(key => {
        // We check two things:
        // 1. The new value is not referencely equal to the previous. This
        //    is just a minor optimization.
        // 2. The old value isn't a component. Overwriting a component means
        //    losing it's patched prototype and therefore invoking it's
        //    methods will not use the store's dispatch function anymore
        //    (and will mutate the component state directly).
        if (self[key] !== newScopedState[key] && !(self[key] instanceof Component)) {
            self[key] = newScopedState[key];
            propsAssigned.push(key);
        }
    });

    // delete left-overs from previous state
    var propsDeleted: string[] = [];
    Object.keys(component).forEach(key => {
        if (!newScopedState.hasOwnProperty(key)) {
            delete self[key];
            propsDeleted.push(key);
        }
    });

    // log
    if (propsDeleted.length || propsAssigned.length) {
        log.verbose('[updateState] store after: ', newScopedState);
        log.verbose('[updateState] component after: ', component);
        log.debug(`[updateState] state of ${path.join('.')} changed`);
        if (propsDeleted.length) {
            log.debug('[updateState] props deleted: ', propsDeleted);
        } else {
            log.verbose('[updateState] props deleted: ', propsDeleted);
        }
        if (propsAssigned.length) {
            log.debug('[updateState] props assigned: ', propsAssigned);
        } else {
            log.verbose('[updateState] props assigned: ', propsAssigned);
        }
    } else {
        log.verbose('[updateState] no change');
    }
}