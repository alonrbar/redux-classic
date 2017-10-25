import { AnyAction, Reducer, ReducersMapObject, Store } from 'redux';
import { ComponentId, Computed } from '../decorators';
import { getActionName } from '../options';
import { getMethods, isPrimitive, log, simpleCombineReducers } from '../utils';
import { Metadata } from './metadata';
import { Schema } from './schema';

// tslint:disable:member-ordering

export class Component<T extends object = object> {

    private static readonly identityReducer = (state: any) => state;

    //
    // public
    //

    public static create<T extends object>(store: Store<T>, schema: T, parent?: object, path: string[] = [], visited = new Set()): Component<T> {
        // tslint:disable-next-line:variable-name
        var ComponentClass = Component.getComponentClass(schema);
        return new ComponentClass(store, schema, parent, path, visited);
    }

    public static getReducerFromTree(obj: object, path: string[] = [], visited: Set<any> = new Set()): Reducer<any> {

        // no need to search inside primitives
        if (isPrimitive(obj))
            return undefined;

        // prevent endless loops on circular references
        if (visited.has(obj))
            return undefined;
        visited.add(obj);

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
    // private - new component class creation
    //

    private static getComponentClass(creator: object): typeof Component {
        var schema = Schema.getSchema(creator);
        if (!schema.componentClass) {
            schema.componentClass = Component.createComponentClass(creator);
        }
        return schema.componentClass;
    }

    private static createComponentClass<T extends object>(creator: object) {

        // declare new class
        class ComponentClass extends Component<T> {
            constructor(store: Store<T>, schemaArg: T, ...params: any[]) {
                super(store, schemaArg, ...params);
            }
        }

        // patch it's prototype
        const actions = Component.createActions(creator);
        Object.assign(ComponentClass.prototype, actions);

        return ComponentClass;
    }

    private static createActions(creator: object): any {

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
                    const meta = Metadata.getMeta(this);
                    meta.dispatch({
                        type: getActionName(creator, key, schema.options),
                        id: (meta ? meta.id : undefined),
                        payload: payload
                    });
                }
            };
        });

        return componentActions;
    }

    //
    // private - new component instance creation
    //

    private static createSelf(component: Component, store: Store<object>, creator: object, parentCreator: any, path: string[]): void {

        // regular js props
        for (let key of Object.keys(creator)) {
            (component as any)[key] = (creator as any)[key];
        }

        // component metadata
        const meta = Metadata.createMeta(component);
        meta.id = ComponentId.getComponentId(parentCreator, path);
        meta.dispatch = store.dispatch;

        // computed properties
        const schema = Schema.getSchema(creator);
        Computed.setupComputedProps(component, schema);

        // reducer
        meta.reducer = Component.createReducer(component, creator);
    }

    private static createSubComponents(obj: any, store: Store<object>, creator: object, path: string[], visited: Set<any>): void {

        // no need to search inside primitives
        if (isPrimitive(obj))
            return;

        // prevent endless loops on circular references
        if (visited.has(obj))
            return;
        visited.add(obj);

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
            var actionName = getActionName(creator, methName, options);
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
                return component;
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
    // Note: Component methods are static to avoid naming collisions on the
    // prototype.
    //
    // TODO: reconsider...
    //
}