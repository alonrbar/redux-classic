import { SchemaOptions } from '../options';
import { COMPONENT_SCHEMA, getSymbol, setSymbol } from '../symbols';
import { Getter, IMap } from '../types';
import { getConstructorProp } from '../utils';
import { Component } from './component';

// tslint:disable:ban-types

/**
 * Metadata used in the creation of the component. Stored on the component
 * creator's constructor (the "component creator" is the class that was
 * decorated with the @component decorator).
 */
export class Schema {

    //
    // public static
    //

    public static getSchema(obj: object | Function): Schema {
        if (!obj)
            return undefined;

        if (typeof obj === 'object') {
            return getConstructorProp(obj, COMPONENT_SCHEMA);
        } else {
            return getSymbol(obj, COMPONENT_SCHEMA);
        }
    }

    public static getOrCreateSchema(obj: object | Function): Schema {

        // get previous
        var schema = Schema.getSchema(obj);

        // create if no previous
        if (!schema) {
            const isConstructor = (typeof obj === 'function' ? true : false);
            const target = (isConstructor ? obj : obj.constructor);
            schema = setSymbol(target, COMPONENT_SCHEMA, new Schema());
        }

        return schema;
    }

    /**
     * Throws if 'obj' is not a componentSchema.
     */
    public static assertSchema(obj: object, msg?: string): void {
        if (!Schema.getSchema(obj))
            throw new Error(msg || 'Invalid argument. Decorated component expected.');
    }

    //
    // instance members
    //

    public componentClass: typeof Component;
    public options: SchemaOptions;
    public computedGetters: IMap<Getter> = {};
    public noDispatch: IMap<boolean> = {};
    public childIds: any = {};
}