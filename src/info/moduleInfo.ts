import { Dispatch } from 'redux';
import { Module, ReducerCreator } from '../module';
import { getSymbol, MODULE_INFO, setSymbol } from '../symbols';

// tslint:disable:ban-types

/**
 * Metadata stored on every module instance.
 */
export class ModuleInfo {

    public static getInfo(mod: Module): ModuleInfo {
        if (!mod)
            return undefined;

        return getSymbol(mod, MODULE_INFO);
    }

    public static initInfo(mod: Module, template: object, dispatch: Dispatch<any>, id: any): ModuleInfo {
        const info = new ModuleInfo(template, dispatch, id);
        return setSymbol(mod, MODULE_INFO, info);
    }

    public readonly id: any;
    public readonly originalClass: Function;
    public readonly dispatch: Dispatch<any>;
    public reducerCreator: ReducerCreator;

    constructor(template: object, dispatch: Dispatch<any>, id: any) {
        this.originalClass = template.constructor;
        this.dispatch = dispatch;
        this.id = id;
    }
}