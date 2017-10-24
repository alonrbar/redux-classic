import { AnyAction, Reducer, ReducersMapObject, Store } from 'redux';
import { addComputed, reducerWithComputed, setComponentId } from '../decorators';
import { getActionName, getSchemaOptions } from '../options';
import { COMPONENT_ID, DISPOSE, getSymbol, REDUCER, setSymbol } from '../symbols';
import { getMethods, getProp, isPrimitive, log, simpleCombineReducers } from '../utils';
import { getComponentClass, isComponentSchema } from './componentSchema';

// TODO: export type IStateListener<T> = (state: T) => void;
// TODO: add listensTo option

export class Component<T extends object> {

    public static create<T extends object>(store: Store<T>, schema: T, parent?: object, path: string[] = [], visited = new Set()): Component<T> {
        // tslint:disable-next-line:variable-name
        var ComponentClass = getComponentClass(schema, store.dispatch);
        return new ComponentClass(store, schema, parent, path, visited);
    }

    //
    // IMPORTANT: 
    //
    // The constructor should not be accessed directly. Call Component.create()
    // instead. It is only public to allow the createComponentClass() function to
    // compile.
    //

    /**
     * IMPORTANT: Don't use the constructor. Call Component.create instead.
     */
    constructor(store: Store<T>, schema: T, parentSchema?: object, path: string[] = [], visited = new Set()) {

        if (!isComponentSchema(schema))
            throw new Error(`Argument '${nameof(schema)}' is not a component schema. Did you forget to use the decorator?`);

        createSelf(this, store, schema, parentSchema, path);
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

function createSelf(component: Component<object>, store: Store<object>, schema: object, parentSchema: any, path: string[]): void {

    setSymbol(component, DISPOSE, []);

    // decorator - withId
    setComponentId(component, parentSchema, path);

    // decorator - computed
    addComputed(component, schema);

    // regular js props
    for (let key of Object.keys(schema)) {
        (component as any)[key] = (schema as any)[key];
    }

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

    // no need to search for components inside primitives
    if (isPrimitive(obj))
        return;

    // search for sub-components
    const searchIn = schema || obj;
    for (let key of Object.keys(searchIn)) {
        var subSchema = searchIn[key];
        var subPath = path.concat([key]);
        if (isComponentSchema(subSchema)) {
            obj[key] = Component.create(store, subSchema, schema, subPath, visited);
        } else {
            createSubComponents(obj[key], store, null, subPath, visited);
        }
    }
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

    var resultReducer = rootReducer;

    // combine with sub-reducers
    if (Object.keys(subReducers).length) {
        var combinedSubReducer = simpleCombineReducers(subReducers);

        resultReducer = (state: object, action: AnyAction) => {

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

    return reducerWithComputed(resultReducer, obj);
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