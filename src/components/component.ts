import { Store } from 'redux';
import { ComponentId } from '../decorators';
import { ClassInfo, ComponentInfo, CreatorInfo } from '../info';
import { globalOptions } from '../options';
import { ROOT_COMPONENT_PATH } from '../reduxApp';
import { IMap } from '../types';
import { isPrimitive, log } from '../utils';
import { ComponentActions } from './actions';
import { ComponentReducer } from './reducer';

export class ComponentCreationContext {

    public visitedNodes = new Set();
    public visitedCreators = new Map<object, Component>();
    public path = ROOT_COMPONENT_PATH;
    public appName: string;
    public parentCreator: object;
    public createdComponents: IMap<Component> = {};

    constructor(initial?: Partial<ComponentCreationContext>) {
        Object.assign(this, initial);
    }
}

export class Component {

    //
    // static methods
    //

    public static create(store: Store<any>, creator: object, context?: ComponentCreationContext): Component {

        context = Object.assign(new ComponentCreationContext(), context);

        // create the component
        CreatorInfo.getOrInitInfo(creator);
        const ComponentClass = Component.getComponentClass(creator);  // tslint:disable-line:variable-name
        const component = new ComponentClass(store, creator, context as ComponentCreationContext);

        return component;
    }

    private static getComponentClass(creator: object): typeof Component {
        const info = CreatorInfo.getInfo(creator);
        if (!info.componentClass) {
            info.componentClass = Component.createComponentClass(creator);
            info.originalClass = creator.constructor;
        }
        return info.componentClass;
    }

    private static createComponentClass(creator: object) {

        // declare new class
        class ComponentClass extends Component {
            public __originalClassName__ = creator.constructor.name; // tslint:disable-line:variable-name

            constructor(store: Store<any>, creatorArg: object, context: ComponentCreationContext) {
                super(store, creatorArg, context);

                if (!globalOptions.emitClassNames)
                    delete this.__originalClassName__;
            }
        }

        // patch it's prototype
        const actions = ComponentActions.createActions(creator);
        Object.assign(ComponentClass.prototype, actions);

        return ComponentClass;
    }

    private static createSelf(component: Component, store: Store<object>, creator: object, context: ComponentCreationContext): void {

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

        selfInfo.id = ComponentId.getComponentId(context.parentCreator, context.path);
        selfInfo.originalClass = creatorInfo.originalClass;
        selfClassInfo.ignoreState = creatorClassInfo.ignoreState;

        // dispatch
        selfInfo.dispatch = store.dispatch;

        // reducer
        selfInfo.reducerCreator = ComponentReducer.createReducer(component, creator);
    }

    private static createSubComponents(treeNode: any, store: Store<object>, creator: object, context: ComponentCreationContext): void {

        // no need to search inside primitives
        if (isPrimitive(treeNode))
            return;

        // prevent endless loops on circular references
        if (context.visitedNodes.has(treeNode))
            return;
        context.visitedNodes.add(treeNode);

        // traverse children
        const searchIn = creator || treeNode;
        for (let key of Object.keys(searchIn)) {

            var subPath = context.path + '.' + key;

            var subCreator = searchIn[key];
            if (CreatorInfo.getInfo(subCreator)) {

                if (context.visitedCreators.has(subCreator)) {

                    // child is an existing sub-component
                    treeNode[key] = context.visitedCreators.get(subCreator);

                } else {

                    // child is a new sub-component                    
                    treeNode[key] = Component.create(store, subCreator, {
                        ...context,
                        parentCreator: creator,
                        path: subPath
                    });
                }
            } else {

                // child is regular object, nothing special to do with it
                Component.createSubComponents(treeNode[key], store, null, {
                    ...context,
                    parentCreator: null,
                    path: subPath
                });
            }
        }
    }

    //
    // constructor
    //

    private constructor(store: Store<any>, creator: object, context: ComponentCreationContext) {

        if (!CreatorInfo.getInfo(creator))
            throw new Error(`Argument '${nameof(creator)}' is not a component creator. Did you forget to use the decorator?`);

        Component.createSelf(this, store, creator, context);
        context.createdComponents[context.path] = this;
        context.visitedCreators.set(creator, this);
        log.verbose(`[Component] New ${creator.constructor.name} component created. Path: ${context.path}`);

        Component.createSubComponents(this, store, creator, context);
    }

    // 
    // Note: Component methods are static so that they will not be exposed unnecessarily through the prototype chain.
    //
}