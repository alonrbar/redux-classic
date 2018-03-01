import { Component } from '../components';
import { COMPONENT_TEMPLATE_INFO, getOwnSymbol, getSymbol, setSymbol } from '../symbols';
import { IMap } from '../types';
import { getConstructorOwnProp } from '../utils';

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

        if (typeof obj === 'object') {
            return getConstructorOwnProp(obj, COMPONENT_TEMPLATE_INFO);
        } else {
            return getOwnSymbol(obj, COMPONENT_TEMPLATE_INFO);
        }
    }

    public static getOrInitInfo(obj: object | Function): ComponentTemplateInfo {

        // get previous
        var info = ComponentTemplateInfo.getInfo(obj);

        // create if no previous
        if (!info) {
            const isConstructor = (typeof obj === 'function' ? true : false);
            const target = (isConstructor ? obj : obj.constructor);
            const baseInfo = getSymbol(target, COMPONENT_TEMPLATE_INFO);
            const selfInfo = Object.assign(new ComponentTemplateInfo(), baseInfo);
            info = setSymbol(target, COMPONENT_TEMPLATE_INFO, selfInfo);
        }

        return info;
    }    

    //
    // instance members
    //

    public originalClass: Function;
    public componentClass: typeof Component;
    public actions: IMap<boolean> = {};
    public sequences: IMap<boolean> = {};
    public childIds: any = {};
}