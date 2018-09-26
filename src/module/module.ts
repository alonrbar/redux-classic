import { ClassInfo, ModuleInfo, ModuleTemplateInfo } from '../info';
import { log } from '../utils';
import { ModuleActions } from './actions';
import { ModuleReducer } from './reducer';

// tslint:disable:ban-types

export function moduleDecorator(ctor: Function) {
    const ModuleClass = ReduxModule.getModuleClass(ctor); // tslint:disable-line:variable-name

    return ModuleClass;
}

export class ReduxModule {

    public static getModuleClass(ctor: Function): typeof ReduxModule {
        const info = ModuleTemplateInfo.getOrInitInfo(ctor);
        if (!info.moduleClass) {
            info.moduleClass = ReduxModule.createModuleClass(ctor);
        }
        return info.moduleClass;
    }

    private static createModuleClass(ctor: Function): typeof ReduxModule {

        // create new module class
        const moduleClassFactory = new Function(
            'initCallback',
            `"use strict"; return function ${ctor.name}_ReduxModule() { initCallback(this, arguments); }`
        );
        const ModuleClass = moduleClassFactory(ReduxModule.createModuleInitCallback(ctor));  // tslint:disable-line:variable-name
        ModuleClass.prototype = Object.create(ctor.prototype);
        ModuleClass.prototype.constructor = ModuleClass;

        // patch it's prototype
        const actions = ModuleActions.createActions(ctor);
        Object.assign(ModuleClass.prototype, actions);

        return ModuleClass;
    }

    private static createModuleInitCallback(originalCtor: Function) {
        return (self: any, args: any) => {

            //
            // this is the ReduxModule (pseudo) constructor
            //

            originalCtor.apply(self, args); // super call

            // init module info
            const selfInfo = ModuleInfo.initInfo(this, template, store.dispatch);

            // copy info from template
            const selfClassInfo = ClassInfo.getOrInitInfo(this);
            const templateClassInfo = ClassInfo.getInfo(template) || new ClassInfo();
            selfClassInfo.ignoreState = templateClassInfo.ignoreState;

            // reducer
            selfInfo.reducerCreator = ModuleReducer.createReducer(this, template);

            log.verbose(`[ReduxModule] New ${originalCtor.name} module created.`);
        };
    }
}