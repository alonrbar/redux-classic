import { Dispatch } from 'redux';
import { ReduxModule, ReducerCreator } from '../module';
import { getSymbol, MODULE_INFO, setSymbol } from '../symbols';

// tslint:disable:ban-types

/**
 * Metadata stored on every module instance.
 */
export class ModuleInfo {

    public static getInfo(mod: ReduxModule): ModuleInfo {
        if (!mod)
            return undefined;

        return getSymbol(mod, MODULE_INFO);
    }

    public static initInfo(mod: ReduxModule, template: object, dispatch: Dispatch<any>): ModuleInfo {
        const info = new ModuleInfo(template, dispatch);
        return setSymbol(mod, MODULE_INFO, info);
    }

    public readonly originalClass: Function;
    public readonly dispatch: Dispatch<any>;
    public reducerCreator: ReducerCreator;

    constructor(template: object, dispatch: Dispatch<any>) {
        this.originalClass = template.constructor;
        this.dispatch = dispatch;
    }
}