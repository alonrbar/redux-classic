import { AnyAction, Dispatch, Reducer, Store } from 'redux';
import { isComponentSchema } from './componentSchema';
import { debug, verbose } from './log';
import { getActionName, getSchemaOptions } from './options';
import { getMethods, getProp, getPrototype } from './utils';

export const REDUCER = Symbol('REDUCER');
const DISPOSE = Symbol('DISPOSE');

// TODO: export type IStateListener<T> = (state: T) => void;

export class Component<T> {

    constructor(store: Store<T>, schema: T, path: string[]) {

        if (!isComponentSchema(schema))
            throw new Error(`Argument '${nameof(schema)}' is not a component schema. Did you forget to use the decorator?`);

        (this as any)[DISPOSE] = [];

        createSelf(this, store, schema, path);
        createSubComponents(this, store, schema, path);

        debug(`[Component] new ${schema.constructor.name} component created. path: ${path.join('.')}`);
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

function createSelf<T>(component: Component<T>, store: Store<T>, schema: T, path: string[]): void {

    // regular js props
    for (let key of Object.keys(schema)) {
        (component as any)[key] = (schema as any)[key];
    }

    // actions
    const proto = getPrototype(component);
    const patchedProto = createActions(store.dispatch, schema);
    Object.assign(proto, patchedProto);

    // reducer
    (component as any)[REDUCER] = createReducer(schema);

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
            (component as any)[key] = new Component(store, subSchema, path.concat([key]));
        }
    }
}

function createActions<T>(dispatch: Dispatch<T>, schema: T): any {

    var methods = getMethods(schema);
    if (!methods)
        return undefined;

    var outputActions: any = {};
    Object.keys(methods).forEach(key => {
        outputActions[key] = (...payload: any[]): void => {
            dispatch({
                type: getActionName(key, schema),
                payload: payload
            });
        };
    });

    return outputActions;
}

function createReducer<T>(schema: T): Reducer<T> {

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