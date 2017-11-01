import { SchemaOptions } from '../options';
import { CREATOR_INFO, getSymbol, setSymbol } from '../symbols';
import { Getter, IMap } from '../types';
import { getConstructorProp } from '../utils';
import { Component } from './component';

// tslint:disable:ban-types

/**
 * Metadata information stored on "component creators" - classes that were
 * decorated with the @component decorator. Since it is common to all instances
 * it is stored on the class constructor. It is used for the most part in the
 * component creation process.
 */
export class CreatorInfo {

    //
    // public static
    //

    public static getInfo(obj: object | Function): CreatorInfo {
        if (!obj)
            return undefined;

        if (typeof obj === 'object') {
            return getConstructorProp(obj, CREATOR_INFO);
        } else {
            return getSymbol(obj, CREATOR_INFO);
        }
    }

    public static getOrInitInfo(obj: object | Function): CreatorInfo {

        // get previous
        var info = CreatorInfo.getInfo(obj);

        // create if no previous
        if (!info) {
            const isConstructor = (typeof obj === 'function' ? true : false);
            const target = (isConstructor ? obj : obj.constructor);
            info = setSymbol(target, CREATOR_INFO, new CreatorInfo());
        }

        return info;
    }

    /**
     * Throws if 'obj' is not a componentSchema.
     */
    public static assertSchema(obj: object, msg?: string): void {
        if (!CreatorInfo.getInfo(obj))
            throw new Error(msg || 'Invalid argument. Decorated component expected.');
    }

    //
    // instance members
    //

    public originalClass: Function;
    public componentClass: typeof Component;
    public options: SchemaOptions;
    public computedGetters: IMap<Getter> = {};    
    public noDispatch: IMap<boolean> = {};
    public childIds: any = {};
}