import { AnyAction, Reducer, ReducersMapObject, Store } from 'redux';
import { ComponentId, Computed, Connect } from '../decorators';
import { getActionName, globalOptions } from '../options';
import { appsRepository, DEFAULT_APP_NAME } from '../reduxApp';
import { getMethods, isPrimitive, log, pathString, simpleCombineReducers } from '../utils';
import { ComponentInfo } from './componentInfo';
import { CreatorInfo } from './creatorInfo';

// tslint:disable:member-ordering variable-name

export class Component<T extends object = object> {

    private static readonly identityReducer = (state: any) => state;

    //
    // public
    //

    public static create<T extends object>(store: Store<T>, creator: T, parentCreator?: object, path: string[] = [], visited = new Set()): Component<T> {

        // create the component
        var ComponentClass = Component.getComponentClass(creator);
        const component = new ComponentClass(store, creator, parentCreator, path, visited);

        // register it on it's containing app
        Component.registerComponent(component, creator, path);

        return component;
    }

    public static getReducerFromTree(obj: object, visited: Set<any> = new Set()): Reducer<any> {

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
            rootReducer = Component.identityReducer;
        }

        // gather the sub-reducers
        const subReducers: ReducersMapObject = {};
        for (let key of Object.keys(obj)) {

            if (Connect.getConnectionInfo(obj, key)) {

                // connected components
                subReducers[key] = Connect.connectReducer;

            } else {

                // other objects
                var newSubReducer = Component.getReducerFromTree((obj as any)[key], visited);
                if (typeof newSubReducer === 'function')
                    subReducers[key] = newSubReducer;
            }
        }

        var resultReducer = rootReducer;

        // combine reducers
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
        var info = CreatorInfo.getInfo(creator);
        if (!info.componentClass) {
            info.componentClass = Component.createComponentClass(creator);
            info.originalClass = creator.constructor;
        }
        return info.componentClass;
    }

    private static createComponentClass<T extends object>(creator: object) {

        // declare new class
        class ComponentClass extends Component<T> {
            public __originalClassName__ = creator.constructor.name; // tslint:disable-line:variable-name

            constructor(store: Store<T>, creatorArg: T, ...params: any[]) {
                super(store, creatorArg, ...params);

                if (!globalOptions.emitClassNames)
                    delete this.__originalClassName__;
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

        const creatorInfo = CreatorInfo.getInfo(creator);
        const componentActions: any = {};
        Object.keys(methods).forEach(key => {
            componentActions[key] = function (this: Component<object>, ...payload: any[]): void {

                // verify 'this' arg
                if (!(this instanceof Component))
                    throw new Error(`Component method invoked with non-Component as 'this'. Bound 'this' argument is: ${this}`);

                const oldMethod = methods[key];
                if (creatorInfo.noDispatch[key]) {

                    // handle non-dispatch methods (just call the function)
                    oldMethod.call(this, ...payload);
                } else {

                    // handle dispatch methods (use store dispatch)
                    const compInfo = ComponentInfo.getInfo(this);
                    compInfo.dispatch({
                        type: getActionName(creator, key, creatorInfo.options),
                        id: compInfo.id,
                        payload: payload
                    });
                }
            };
        });

        return componentActions;
    }

    private static registerComponent(comp: Component, creator: object, path: string[]): void {
        const appName = path[0] || DEFAULT_APP_NAME;
        const app = appsRepository[appName];
        // const selfPropName = path[path.length - 1];
        const isConnected = false; // isConnectedProperty(crea)
        if (app && !isConnected) {
            const warehouse = app.getTypeWarehouse(creator.constructor);
            const key = ComponentInfo.getInfo(comp).id || warehouse.size;
            warehouse.set(key, comp);
        }
    }

    //
    // private - new component instance creation
    //

    private static createSelf(component: Component, store: Store<object>, creator: object, parentCreator: any, path: string[]): void {

        // regular js props (including getters and setters)
        for (let key of Object.getOwnPropertyNames(creator)) {
            var desc = Object.getOwnPropertyDescriptor(creator, key);
            Object.defineProperty(component, key, desc);
        }

        // component metadata        
        const selfInfo = ComponentInfo.initInfo(component);
        const creatorInfo = CreatorInfo.getInfo(creator);        

        selfInfo.id = ComponentId.getComponentId(parentCreator, path);
        selfInfo.originalClass = creatorInfo.originalClass;        

        // computed props
        Computed.setupComputedProps(component, creatorInfo, selfInfo);

        // connected props
        Connect.setupConnectedProps(component, creator);

        // dispatch
        selfInfo.dispatch = store.dispatch;

        // reducer
        selfInfo.reducer = Component.createReducer(component, creator);
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

            const connectionInfo = Connect.getConnectionInfo(obj, key);
            if (connectionInfo) {
                log.verbose(`[createSubComponents] Property in path '${pathString(path)}.${key}' is connected. Skipping component creation.`);
                continue;
            }

            var subPath = path.concat([key]);

            var subCreator = searchIn[key];
            if (CreatorInfo.getInfo(subCreator)) {

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
        const options = CreatorInfo.getInfo(creator).options;
        const methodNames: any = {};
        Object.keys(methods).forEach(methName => {
            var actionName = getActionName(creator, methName, options);
            methodNames[actionName] = methName;
        });

        // component id
        const componentId = ComponentInfo.getInfo(component).id;

        // the reducer
        return (state: object, action: AnyAction) => {

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
            var newState = Object.assign({}, state);
            actionReducer.call(newState, ...action.payload);

            // return new state
            log.verbose('[reducer] Reducer invoked, returning new state');
            return newState;
        };
    }

    //
    // constructor
    //

    private constructor(store: Store<T>, creator: T, parentCreator?: object, path: string[] = [], visited = new Set()) {

        if (!CreatorInfo.getInfo(creator))
            throw new Error(`Argument '${nameof(creator)}' is not a component creator. Did you forget to use the decorator?`);

        Component.createSelf(this, store, creator, parentCreator, path);
        Component.createSubComponents(this, store, creator, path, visited);

        log.debug(`[Component] New ${creator.constructor.name} component created. path: ${pathString(path)}`);
    }

    // 
    // Note: Component methods are static so that they will not be exposed unnecessarily through the prototype chain.
    //
}