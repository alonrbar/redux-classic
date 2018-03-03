import { Component } from '../components';
import { COMPONENT_TEMPLATE_INFO, getOwnSymbol, getSymbol, setSymbol } from '../symbols';
import { IMap } from '../types';
import { getConstructorOwnProp, getConstructorProp } from '../utils';

// tslint:disable:ban-types

/**
 * Metadata information stored on "component templates" - classes that were
 * decorated with one of the component decorators (@action, @sequence, etc.).
 * Since it is common to all instances it is stored on the class constructor. It
 * is used for the most part in the component creation process.
 */
export class ComponentTemplateInfo {

    //
    // public static
    //

    public static getInfo(obj: object | Function): ComponentTemplateInfo {
        if (!obj)
            return undefined;

        let ownInfo = ComponentTemplateInfo.getOwnInfo(obj);
        if (ownInfo)
            return ownInfo;

        // if base class is a component template so should this class be
        const baseInfo = ComponentTemplateInfo.getBaseInfo(obj);
        if (baseInfo)
            return ComponentTemplateInfo.initInfo(obj);

        return undefined;
    }

    public static getOrInitInfo(obj: object | Function): ComponentTemplateInfo {

        // get previous
        const info = ComponentTemplateInfo.getInfo(obj);
        if (info)
            return info;

        // create if no previous
        return ComponentTemplateInfo.initInfo(obj);
    }

    //
    // private static
    //

    private static getOwnInfo(obj: object | Function): ComponentTemplateInfo {
        if (typeof obj === 'object') {
            return getConstructorOwnProp(obj, COMPONENT_TEMPLATE_INFO);
        } else {
            return getOwnSymbol(obj, COMPONENT_TEMPLATE_INFO);
        }
    }

    private static getBaseInfo(obj: object | Function): ComponentTemplateInfo {
        if (typeof obj === 'object') {
            return getConstructorProp(obj, COMPONENT_TEMPLATE_INFO);
        } else {
            return getSymbol(obj, COMPONENT_TEMPLATE_INFO);
        }
    }

    private static initInfo(obj: object | Function): ComponentTemplateInfo {
        // information is stored on the class constructor to 
        // be available to all class instances
        const isConstructor = (typeof obj === 'function' ? true : false);
        const target = (isConstructor ? obj : obj.constructor);

        // derive initial info from base class, if any
        const baseInfo = getSymbol(target, COMPONENT_TEMPLATE_INFO);

        // set own info
        const selfInfo = Object.assign(new ComponentTemplateInfo(), baseInfo);
        return setSymbol(target, COMPONENT_TEMPLATE_INFO, selfInfo);
    }

    //
    // instance members
    //

    public componentClass: typeof Component;
    public actions: IMap<boolean> = {};
    public sequences: IMap<boolean> = {};
    public childIds: any = {};
}