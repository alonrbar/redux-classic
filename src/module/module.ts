import { Store } from 'redux';
import { ModuleId } from '../decorators';
import { ClassInfo, ModuleInfo, ModuleTemplateInfo } from '../info';
import { ROOT_MODULE_PATH } from '../reduxClassic';
import { IMap } from '../types';
import { defineProperties, DescriptorType, isPrimitive, log } from '../utils';
import { ModuleActions } from './actions';
import { ModuleReducer } from './reducer';

export class ModuleCreationContext {

    public visitedNodes = new Set();
    public visitedTemplates = new Map<object, Module>();
    public path = ROOT_MODULE_PATH;
    public appName: string;
    public parentTemplate: object;
    public createdModules: IMap<Module> = {};

    constructor(initial?: Partial<ModuleCreationContext>) {
        Object.assign(this, initial);
    }
}

export class Module {

    //
    // static methods
    //

    public static create(store: Store<any>, template: object, context?: ModuleCreationContext): Module {

        context = Object.assign(new ModuleCreationContext(), context);

        // create the module
        ModuleTemplateInfo.getOrInitInfo(template);
        const ModuleClass = Module.getModuleClass(template);  // tslint:disable-line:variable-name
        const mod = new ModuleClass(store, template, context as ModuleCreationContext);

        return mod;
    }

    private static getModuleClass(template: object): typeof Module {
        const info = ModuleTemplateInfo.getInfo(template);
        if (!info.moduleClass) {
            info.moduleClass = Module.createModuleClass(template);
        }
        return info.moduleClass;
    }

    private static createModuleClass(template: object): typeof Module {

        // create new module class
        const moduleClassFactory = new Function(
            'initCallback', 
            `"use strict"; return function ${template.constructor.name}_ReduxModule() { initCallback(this, arguments); }`
        );
        const ModuleClass = moduleClassFactory((self: any, args: any) => Module.apply(self, args));  // tslint:disable-line:variable-name
        ModuleClass.prototype = Object.create(Module.prototype);
        ModuleClass.prototype.constructor = ModuleClass;

        // patch it's prototype
        const actions = ModuleActions.createActions(template);
        Object.assign(ModuleClass.prototype, actions);

        return ModuleClass;
    }

    private static createSelf(mod: Module, store: Store<object>, template: object, context: ModuleCreationContext): void {

        // regular js props (including getters and setters)
        defineProperties(mod, template, [DescriptorType.Field, DescriptorType.Property]);

        // init module info        
        const id = ModuleId.getModuleId(context.parentTemplate, context.path);
        const selfInfo = ModuleInfo.initInfo(mod, template, store.dispatch, id);
        
        // copy info from template
        const selfClassInfo = ClassInfo.getOrInitInfo(mod);
        const templateClassInfo = ClassInfo.getInfo(template) || new ClassInfo();
        selfClassInfo.ignoreState = templateClassInfo.ignoreState;

        // reducer
        selfInfo.reducerCreator = ModuleReducer.createReducer(mod, template);
    }

    private static createSubModules(treeNode: any, store: Store<object>, template: object, context: ModuleCreationContext): void {

        // no need to search inside primitives
        if (isPrimitive(treeNode))
            return;

        // prevent endless loops on circular references
        if (context.visitedNodes.has(treeNode))
            return;
        context.visitedNodes.add(treeNode);

        // traverse children
        const searchIn = template || treeNode;
        for (let key of Object.keys(searchIn)) {

            var subPath = context.path + '.' + key;

            var subTemplate = searchIn[key];
            if (ModuleTemplateInfo.getInfo(subTemplate)) {

                if (context.visitedTemplates.has(subTemplate)) {

                    // child is an existing sub-module
                    treeNode[key] = context.visitedTemplates.get(subTemplate);

                } else {

                    // child is a new sub-module                    
                    treeNode[key] = Module.create(store, subTemplate, {
                        ...context,
                        parentTemplate: template,
                        path: subPath
                    });
                }
            } else {

                // child is regular object, nothing special to do with it
                Module.createSubModules(treeNode[key], store, null, {
                    ...context,
                    parentTemplate: null,
                    path: subPath
                });
            }
        }
    }

    //
    // constructor
    //

    private constructor(store: Store<any>, template: object, context: ModuleCreationContext) {

        if (!ModuleTemplateInfo.getInfo(template))
            throw new Error(`Argument '${nameof(template)}' is not a module template. Did you forget to use decorators?`);

        Module.createSelf(this, store, template, context);
        context.createdModules[context.path] = this;
        context.visitedTemplates.set(template, this);
        log.verbose(`[Module] New ${template.constructor.name} module created. Path: ${context.path}`);

        Module.createSubModules(this, store, template, context);
    }

    // 
    // Note: Module methods are static so that they will not be exposed unnecessarily through the prototype chain.
    //
}