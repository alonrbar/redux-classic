import { AnyAction, Dispatch, Reducer, Store } from 'redux';
import { isComponentSchema } from './componentSchema';
import { debug, verbose } from './log';
import { getActionName, getSchemaOptions } from './options';
import { getMethods, getProp } from './utils';
import { WITH_ID, DISPOSE, REDUCER, AUTO_ID } from './symbols';

// TODO: export type IStateListener<T> = (state: T) => void;

export class Component<T> {

    constructor(store: Store<T>, schema: T, parent: any, path: string[]) {

        if (!isComponentSchema(schema))
            throw new Error(`Argument '${nameof(schema)}' is not a component schema. Did you forget to use the decorator?`);

        (this as any)[DISPOSE] = [];

        createSelf(this, store, schema, parent, path);
        createSubComponents(this, store, schema, path);

        debug(`[Component] new ${schema.constructor.name} component created. path: root.${path.join('.')}`);
    }

    public disposeComponent(): void {
        const disposables: any[] = (this as any)[DISPOSE];
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

function createSelf<T>(component: Component<T>, store: Store<T>, schema: T, parent: any, path: string[]): void {

    // regular js props
    for (let key of Object.keys(schema)) {
        (component as any)[key] = (schema as any)[key];
    }

    // actions
    const actionInvokers = createActions(store.dispatch, schema, parent, path);
    Object.assign(component, actionInvokers);

    // reducer
    (component as any)[REDUCER] = createReducer(schema, parent, path);

    // state
    const options = getSchemaOptions(schema);
    if (options.updateState) {
        const unsubscribe = store.subscribe(() => updateState(component, store.getState(), path));
        (component as any)[DISPOSE].push({ dispose: () => unsubscribe() });
    }
}

function createSubComponents<T>(component: Component<T>, store: Store<T>, schema: T, path: string[]): void {
    for (let key of Object.keys(schema)) {
        var subSchema = (schema as any)[key];
        if (isComponentSchema(subSchema)) {
            (component as any)[key] = new Component(store, subSchema, schema, path.concat([key]));
        }
    }
}

function createActions<T>(dispatch: Dispatch<T>, schema: T, parent: any, path: string[]): any {

    var methods = getMethods(schema);
    if (!methods)
        return undefined;

    var componentId = getComponentId(parent, path);
    var actionInvokers: any = {};
    Object.keys(methods).forEach(key => {
        actionInvokers[key] = (...payload: any[]): void => {
            dispatch({
                type: getActionName(key, schema),
                id: componentId,
                payload: payload
            });
        };
    });

    return actionInvokers;
}

function createReducer<T>(schema: T, parent: any, path: string[]): Reducer<T> {

    var componentId = getComponentId(parent, path);

    // method names lookup
    const methods = getMethods(schema);
    const methodNames: any = {};
    Object.keys(methods).forEach(methName => {
        var actionName = getActionName(methName, schema);
        methodNames[actionName] = methName;
    });

    return (state: T, action: AnyAction) => {

        verbose(`[reducer] reducer of: ${schema.constructor.name}, action: ${action.type}`);

        if (state === undefined) {
            verbose('[reducer] state is undefined, returning initial value');
            return schema;
        }

        if (componentId !== action.id) {
            verbose(`[reducer] component id and action.id don't match (${componentId} !== ${action.id})`);
            return state;
        }

        // check if should use this reducer            
        const methodName = methodNames[action.type];
        const actionReducer = methods[methodName];
        if (!actionReducer) {
            verbose('[reducer] no matching action in this reducer, returning previous state');
            return state;
        }

        // call the action-reducer with the new state as the 'this' argument
        var newState = Object.assign({}, state);
        actionReducer.call(newState, ...action.payload);

        // return new state
        verbose('[reducer] reducer invoked returning new state');
        return newState;
    };
}

function updateState<T>(component: Component<T>, newGlobalState: T, path: string[]): void {

    verbose('[updateState] updating component in path: ', path.join('.'));

    var self = (component as any);
    var newScopedState = getProp(newGlobalState, path);

    var propsDeleted: string[] = [];
    var propsAssigned: string[] = [];

    verbose('[updateState] store before: ', newScopedState);
    verbose('[updateState] component before: ', component);

    // assign new state
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
    Object.keys(component).forEach(key => {
        if (newScopedState[key] === undefined) {
            delete self[key];
            propsDeleted.push(key);
        }
    });

    // log
    if (propsDeleted.length || propsAssigned.length) {
        verbose('[updateState] store after: ', newScopedState);
        verbose('[updateState] component after: ', component);
        debug(`[updateState] state of ${path.join('.')} changed`);
        if (propsDeleted.length) {
            debug('[updateState] props deleted: ', propsDeleted);
        } else {
            verbose('[updateState] props deleted: ', propsDeleted);
        }
        if (propsAssigned.length) {
            debug('[updateState] props assigned: ', propsAssigned);
        } else {
            verbose('[updateState] props assigned: ', propsAssigned);
        }
    } else {
        verbose('[updateState] no change');
    }
}

var autoComponentId = 0;
function getComponentId(parent: any, path: string[]): any {

    // no parent
    if (!parent || !path.length)
        return undefined;

    // withID not used
    const idLookup = parent[WITH_ID];
    if (!idLookup)
        return undefined;

    const selfKey = path[path.length - 1];
    const id = parent[WITH_ID][selfKey];

    // the specific component was not assigned an id
    if (!id)
        return undefined;

    // auto id
    if (id === AUTO_ID) {        
        const generatedId = --autoComponentId;
        verbose('[getComponentId] new component id generated: ' + generatedId);
        parent[WITH_ID][selfKey] = generatedId;
        return generatedId;
    }

    // manual id
    return id;
}