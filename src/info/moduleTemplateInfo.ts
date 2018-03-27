import { Module } from '../module';
import { getOwnSymbol, getSymbol, MODULE_TEMPLATE_INFO, setSymbol } from '../symbols';
import { IMap } from '../types';
import { getConstructorOwnProp, getConstructorProp } from '../utils';

// tslint:disable:ban-types

/**
 * Metadata information stored on "module templates" - classes that were
 * decorated with one of the module decorators (@action, @sequence, etc.). Since
 * it is common to all instances it is stored on the class constructor. It is
 * used for the most part in the module creation process.
 */
export class ModuleTemplateInfo {

    //
    // public static
    //

    public static getInfo(obj: object | Function): ModuleTemplateInfo {
        if (!obj)
            return undefined;

        let ownInfo = ModuleTemplateInfo.getOwnInfo(obj);
        if (ownInfo)
            return ownInfo;

        // if base class is a component template so should this class be
        const baseInfo = ModuleTemplateInfo.getBaseInfo(obj);
        if (baseInfo)
            return ModuleTemplateInfo.initInfo(obj);

        return undefined;
    }

    public static getOrInitInfo(obj: object | Function): ModuleTemplateInfo {

        // get previous
        const info = ModuleTemplateInfo.getInfo(obj);
        if (info)
            return info;

        // create if no previous
        return ModuleTemplateInfo.initInfo(obj);
    }

    //
    // private static
    //

    private static getOwnInfo(obj: object | Function): ModuleTemplateInfo {
        if (typeof obj === 'object') {
            return getConstructorOwnProp(obj, MODULE_TEMPLATE_INFO);
        } else {
            return getOwnSymbol(obj, MODULE_TEMPLATE_INFO);
        }
    }

    private static getBaseInfo(obj: object | Function): ModuleTemplateInfo {
        if (typeof obj === 'object') {
            return getConstructorProp(obj, MODULE_TEMPLATE_INFO);
        } else {
            return getSymbol(obj, MODULE_TEMPLATE_INFO);
        }
    }

    private static initInfo(obj: object | Function): ModuleTemplateInfo {
        // information is stored on the class constructor to 
        // be available to all class instances
        const isConstructor = (typeof obj === 'function' ? true : false);
        const target = (isConstructor ? obj : obj.constructor);

        // derive initial info from base class, if any
        const baseInfo = getSymbol(target, MODULE_TEMPLATE_INFO);

        // set own info
        const selfInfo = Object.assign(new ModuleTemplateInfo(), baseInfo);
        return setSymbol(target, MODULE_TEMPLATE_INFO, selfInfo);
    }

    //
    // instance members
    //

    public moduleClass: typeof Module;
    public actions: IMap<boolean> = {};
    public sequences: IMap<boolean> = {};
    public childIds: any = {};
}