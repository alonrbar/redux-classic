import { AnyAction, Dispatch, Reducer, Store } from 'redux';
import { getComponentId } from '../decorators';
import { getActionName, getSchemaOptions } from '../options';
import { COMPONENT_ID, DISPOSE, NO_DISPATCH, REDUCER } from '../symbols';
import { debug, debugWarn, getMethods, getProp, getPrototype, verbose } from '../utils';
import { isComponentSchema } from './componentSchema';

// TODO: export type IStateListener<T> = (state: T) => void;
// TODO: add listensTo option

export class Component<T extends object> {

    constructor(store: Store<T>, schema: T, parent?: object, path: string[] = [], visited = new Set()) {

        if (!isComponentSchema(schema))
            throw new Error(`Argument '${nameof(schema)}' is not a component schema. Did you forget to use the decorator?`);

        createSelf(this, store, schema, parent, path);
        createSubComponents(this, store, schema, path, visited);

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

function createSelf<T extends object>(component: Component<T>, store: Store<T>, schema: T, parent: any, path: string[]): void {

    (component as any)[DISPOSE] = [];

    // assign ID
    const componentId = getComponentId(parent, path);
    if (componentId !== undefined && componentId !== null) {
        (component as any)[COMPONENT_ID] = componentId;
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
    (component as any)[REDUCER] = createReducer(component, schema);

    // state
    const options = getSchemaOptions(schema);
    if (options.updateState) {
        const unsubscribe = store.subscribe(() => updateState(component, store.getState(), path));
        (component as any)[DISPOSE].push({ dispose: () => unsubscribe() });
    }
}

function createSubComponents<T extends object>(obj: any, store: Store<T>, schema: T, path: string[], visited: Set<any>): void {

    // prevent endless loops on circular references
    if (visited.has(obj))
        return;
    visited.add(obj);

    const searchIn = schema || obj;

    // no need to search for components inside primitives
    if (typeof searchIn !== 'object' && typeof searchIn !== 'function')
        return;

    // must check since typeof null === 'object' ...
    if (!searchIn)
        return;

    // search for sub-components
    for (let key of Object.keys(searchIn)) {
        var subSchema = (searchIn as any)[key];
        var subPath = path.concat([key]);
        if (isComponentSchema(subSchema)) {
            obj[key] = new Component(store, subSchema, schema, subPath, visited);
        } else {
            createSubComponents(obj[key], store, null, subPath, visited);
        }
    }
}

function createActions<T extends object>(dispatch: Dispatch<T>, schema: T): any {

    const methods = getMethods(schema);
    if (!methods)
        return undefined;

    const outputActions: any = {};
    Object.keys(methods).forEach(key => {
        outputActions[key] = function (this: Component<T>, ...payload: any[]): void {

            // verify 'this' arg
            if (!(this instanceof Component)) {
                const msg = "Component method invoked with non-Component as 'this'. " +
                    "Some redux-app features such as the withId decorator will not work. Bound 'this' argument is: ";
                debugWarn(msg, this);
            }

            const oldMethod = methods[key];
            if ((oldMethod as any)[NO_DISPATCH]) {

                // handle non-dispatch methods (just call the function)
                oldMethod.call(this, ...payload);
            } else {

                // handle dispatch methods (use store dispatch)
                dispatch({
                    type: getActionName(key, schema),
                    id: (this as any)[COMPONENT_ID],
                    payload: payload
                });
            }
        };
    });

    return outputActions;
}

function createReducer<T extends object>(component: Component<T>, schema: T): Reducer<T> {

    // method names lookup
    const methods = getMethods(schema);
    const methodNames: any = {};
    Object.keys(methods).forEach(methName => {
        var actionName = getActionName(methName, schema);
        methodNames[actionName] = methName;
    });

    // component id
    const componentId = (component as any)[COMPONENT_ID];

    // the reducer
    return (state: T, action: AnyAction) => {

        verbose(`[reducer] reducer of: ${schema.constructor.name}, action: ${action.type}`);

        // initial state
        if (state === undefined) {
            verbose('[reducer] state is undefined, returning initial value');
            return schema;
        }

        // check component id
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
        verbose('[reducer] reducer invoked, returning new state');
        return newState;
    };
}

function updateState<T extends object>(component: Component<T>, newGlobalState: T, path: string[]): void {

    // vars
    var self = (component as any);
    var newScopedState = getProp(newGlobalState, path);

    // log
    verbose('[updateState] updating component in path: ', path.join('.'));
    verbose('[updateState] store before: ', newScopedState);
    verbose('[updateState] component before: ', component);

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