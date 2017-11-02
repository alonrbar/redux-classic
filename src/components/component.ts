import { Store } from 'redux';
import { ComponentId, Connect } from '../decorators';
import { ClassInfo, ComponentInfo, CreatorInfo } from '../info';
import { globalOptions } from '../options';
import { ReduxApp } from '../reduxApp';
import { isPrimitive, log, pathString } from '../utils';
import { ComponentActions } from './actions';
import { ComponentReducer } from './reducer';

// tslint:disable:member-ordering variable-name

export class Component<T extends object = object> {    

    //
    // static methods
    //

    public static create<T extends object>(store: Store<T>, creator: T, parentCreator?: object, path: string[] = [], visited = new Set()): Component<T> {

        // create the component
        var ComponentClass = Component.getComponentClass(creator);
        const component = new ComponentClass(store, creator, parentCreator, path, visited);

        // register it on it's containing app
        ReduxApp.registerComponent(component, creator, path);

        return component;
    }    

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
        const actions = ComponentActions.createActions(creator);
        Object.assign(ComponentClass.prototype, actions);

        return ComponentClass;
    }       

    private static createSelf(component: Component, store: Store<object>, creator: object, parentCreator: any, path: string[]): void {

        // regular js props (including getters and setters)
        for (let key of Object.getOwnPropertyNames(creator)) {
            var desc = Object.getOwnPropertyDescriptor(creator, key);
            Object.defineProperty(component, key, desc);
        }

        // init component info        
        const selfInfo = ComponentInfo.initInfo(component);
        const selfClassInfo = ClassInfo.getOrInitInfo(component);

        // copy info from creator
        const creatorInfo = CreatorInfo.getInfo(creator);
        const creatorClassInfo = ClassInfo.getInfo(creator) || new ClassInfo();

        selfInfo.id = ComponentId.getComponentId(parentCreator, path);
        selfInfo.originalClass = creatorInfo.originalClass;        
        selfClassInfo.computedGetters = creatorClassInfo.computedGetters;

        // connected props
        Connect.setupConnectedProps(component, selfClassInfo, creator, creatorClassInfo);

        // dispatch
        selfInfo.dispatch = store.dispatch;

        // reducer
        selfInfo.reducer = ComponentReducer.createReducer(component, creator);
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

            const connectionInfo = Connect.isConnectedProperty(obj, key);
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