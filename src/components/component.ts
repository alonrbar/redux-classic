import { AnyAction, Dispatch, Reducer, ReducersMapObject, Store } from 'redux';
import { ComponentId, Computed } from '../decorators';
import { getActionName } from '../options';
import { getMethods, getProp, isPrimitive, log, simpleCombineReducers } from '../utils';
import { Metadata } from './metadata';
import { Schema } from './schema';

// tslint:disable:member-ordering

export class Component<T extends object = object> {

    private static readonly identityReducer = (state: any) => state;

    //
    // public static
    //

    public static create<T extends object>(store: Store<T>, schema: T, parent?: object, path: string[] = [], visited = new Set()): Component<T> {
        // tslint:disable-next-line:variable-name
        var ComponentClass = Component.getComponentClass(schema, store.dispatch);
        return new ComponentClass(store, schema, parent, path, visited);
    }

    public static getReducerFromTree(obj: object, path: string[] = [], visited: Set<any> = new Set()): Reducer<any> {

        // prevent endless loops on circular references
        if (visited.has(obj))
            return undefined;
        visited.add(obj);

        // no need to search inside primitives
        if (isPrimitive(obj))
            return undefined;

        // get the root reducer
        var rootReducer: Reducer<any>;
        const meta = Metadata.getMeta(obj as any);
        if (meta) {
            rootReducer = meta.reducer;
        } else {
            rootReducer = Component.identityReducer;
        }

        // gather the sub-reducers
        const subReducers: ReducersMapObject = {};
        for (let key of Object.keys(obj)) {
            var newSubReducer = Component.getReducerFromTree((obj as any)[key], path.concat(key), visited);
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

        return Computed.wrapReducer(resultReducer, obj);
    }

    //
    // private static
    //

    private static getComponentClass(creator: object, dispatch: Dispatch<object>): typeof Component {
        var schema = Schema.getSchema(creator);
        if (!schema.componentClass) {
            schema.componentClass = Component.createComponentClass(creator, dispatch);
        }
        return schema.componentClass;
    }

    private static createComponentClass<T extends object>(creator: object, dispatch: Dispatch<object>) {

        // declare new class
        class ComponentClass extends Component<T> {
            constructor(store: Store<T>, schemaArg: T, ...params: any[]) {
                super(store, schemaArg, ...params);
            }
        }

        // patch it's prototype
        const actions = Component.createActions(creator, dispatch);
        Object.assign(ComponentClass.prototype, actions);

        return ComponentClass;
    }

    private static createActions(creator: object, dispatch: Dispatch<object>): any {

        const methods = getMethods(creator);
        if (!methods)
            return undefined;

        const schema = Schema.getSchema(creator);
        const componentActions: any = {};
        Object.keys(methods).forEach(key => {
            componentActions[key] = function (this: Component<object>, ...payload: any[]): void {

                // verify 'this' arg
                if (!(this instanceof Component)) {
                    const msg = "Component method invoked with non-Component as 'this'. " +
                        "Some redux-app features such as the withId decorator will not work. Bound 'this' argument is: ";
                    log.warn(msg, this);
                }

                const oldMethod = methods[key];
                if (schema.noDispatch[key]) {

                    // handle non-dispatch methods (just call the function)
                    oldMethod.call(this, ...payload);
                } else {

                    // handle dispatch methods (use store dispatch)
                    dispatch({
                        type: getActionName(key, creator),
                        id: Metadata.getMeta(this).id,
                        payload: payload
                    });
                }
            };
        });

        return componentActions;
    }

    private static createSelf(component: Component, store: Store<object>, creator: object, parentCreator: any, path: string[]): void {

        // regular js props
        for (let key of Object.keys(creator)) {
            (component as any)[key] = (creator as any)[key];
        }

        // component id
        const meta = Metadata.createMeta(component);
        meta.id = ComponentId.getComponentId(parentCreator, path);

        // computed properties
        const schema = Schema.getSchema(creator);
        Computed.setupComputedProps(component, schema);

        // reducer
        meta.reducer = Component.createReducer(component, creator);

        // state        
        if (schema.options.updateState) {
            const unsubscribe = store.subscribe(() => Component.updateState(component, store.getState(), path));
            meta.disposables.push({ dispose: () => unsubscribe() });
        }
    }

    private static createSubComponents(obj: any, store: Store<object>, creator: object, path: string[], visited: Set<any>): void {

        // prevent endless loops on circular references
        if (visited.has(obj))
            return;
        visited.add(obj);

        // no need to search for components inside primitives
        if (isPrimitive(obj))
            return;

        // traverse object children
        const searchIn = creator || obj;
        for (let key of Object.keys(searchIn)) {

            var subPath = path.concat([key]);

            var subCreator = searchIn[key];
            if (Schema.getSchema(subCreator)) {

                // child is sub-component
                obj[key] = Component.create(store, subCreator, creator, subPath, visited);
            } else {

                // child is regular object, nothing special to do with it
                Component.createSubComponents(obj[key], store, null, subPath, visited);
            }
        }
    }

    private static createReducer(component: Component, creator: object): Reducer<object> {

        // method names lookup
        const methods = getMethods(creator);
        const options = Schema.getSchema(creator).options;
        const methodNames: any = {};
        Object.keys(methods).forEach(methName => {
            var actionName = getActionName(methName, options);
            methodNames[actionName] = methName;
        });

        // component id
        const componentId = Metadata.getMeta(component).id;

        // the reducer
        return (state: object, action: AnyAction) => {

            log.verbose(`[reducer] reducer of: ${creator.constructor.name}, action: ${action.type}`);

            // initial state
            if (state === undefined) {
                log.verbose('[reducer] state is undefined, returning initial value');
                return creator;
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

    private static updateState(component: Component, newGlobalState: object, path: string[]): void {

        // vars
        var self = (component as any);
        var newScopedState = getProp(newGlobalState, path);

        // log
        const pathStr = 'root' + (path.length ? '.' : '') + path.join('.');
        log.verbose('[updateState] updating component in path: root.', pathStr);
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
            log.debug(`[updateState] state of ${pathStr} changed`);
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

    //
    // constructor
    //

    private constructor(store: Store<T>, creator: T, parentCreator?: object, path: string[] = [], visited = new Set()) {

        if (!Schema.getSchema(creator))
            throw new Error(`Argument '${nameof(creator)}' is not a component creator. Did you forget to use the decorator?`);

        Component.createSelf(this, store, creator, parentCreator, path);
        Component.createSubComponents(this, store, creator, path, visited);

        log.debug(`[Component] new ${creator.constructor.name} component created. path: root.${path.join('.')}`);
    }

    // 
    // Note: Everything not strictly necessary is held outside of the component class
    // to reduce the chance of naming collisions.
    //

    public disposeComponent(): void {
        const disposables = Metadata.getMeta(this).disposables;
        while (disposables.length) {
            var disposable = disposables.pop();
            if (disposable && disposable.dispose)
                disposable.dispose();
        }
    }
}