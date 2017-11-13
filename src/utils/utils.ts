import { IMap, Method } from '../types';

// tslint:disable:ban-types

/**
 * Return true if 'val' is primitive. For the sake of this test 'null' and
 * 'undefined' are considered primitives.
 */
export function isPrimitive(val: any): boolean {
    if (!val)
        return true;

    const type = typeof val;
    return type !== 'object' && type !== 'function';
}

export function getMethods(obj: object | Function): IMap<Method> {
    if (!obj)
        return undefined;

    var proto: any;
    if (typeof obj === 'object') {
        proto = Object.getPrototypeOf(obj);
    } else if (typeof obj === 'function') {
        proto = obj.prototype;
    } else {
        throw new Error("Expected an object or a function. Got: " + obj);
    }

    if (!proto)
        return undefined;

    var methods: any = {};
    for (let key of Object.keys(proto)) {

        // avoid invoking getters
        var desc = Object.getOwnPropertyDescriptor(proto, key);
        var hasGetter = desc && typeof desc.get === 'function';

        if (!hasGetter && typeof proto[key] === 'function')
            methods[key] = proto[key];
    }

    return methods;
}

export function getConstructorProp(obj: object, key: symbol | string): any {
    return obj && obj.constructor && (obj.constructor as any)[key];
}

/**
 * If 'obj' is a function it's assumed to be a constructor function and returned as-is.
 * If 'obj' is an object it's type is returned.
 * Otherwise the function throws.
 */
export function getType(obj: object | Function): Function {
    if (!obj)
        return undefined;

    // constructor function
    if (typeof obj === 'function')
        return obj;

    // object
    if (typeof obj === 'object')
        return Object.getPrototypeOf(obj).constructor;

    throw new Error("Expected an object or a function. Got: " + obj);
}

export function getParentType(obj: object | Function) {

    // get own type
    var type = getType(obj);

    // get parent type
    return Object.getPrototypeOf(type.prototype).constructor;
}

export function pathString(path: string[]): string {
    const str = `${path.slice(1).join('.')}`;
    const dot = (path.length > 1 ? '.' : '');
    return 'root' + dot + str;
}

export function toPlainObject(obj: any): any {
    const json = JSON.stringify(obj, (key: any, value: any) => value === undefined ? null : value);
    return JSON.parse(json);
}