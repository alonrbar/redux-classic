import { isSymbol } from '../symbols';
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

export function getConstructorOwnProp(obj: object, key: symbol | string): any {
    if (!obj || !obj.constructor)
        return undefined;

    const ctor = (obj.constructor as any);
    if (isSymbol(key) && Object.getOwnPropertySymbols(ctor).includes(key)) {
        return ctor[key];
    } else if (typeof key === 'string' && Object.getOwnPropertyNames(ctor).includes(key)) {
        return ctor[key];
    }

    return undefined;
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

/**
 * Test if an object is a plain object, i.e. is constructed by the built-in
 * Object constructor and inherits directly from Object.prototype or null. 
 *
 * Some built-in objects pass the test, e.g. Math which is a plain object and
 * some host or exotic objects may pass also.
 * 
 * https://stackoverflow.com/questions/5876332/how-can-i-differentiate-between-an-object-literal-other-javascript-objects
 */
export function isPlainObject(obj: any) {
    if (!obj)
        return false;

    if (typeof obj !== 'object')
        return false;

    // if Object.getPrototypeOf supported, use it
    if (typeof Object.getPrototypeOf === 'function') {
        var proto = Object.getPrototypeOf(obj);
        return proto === Object.prototype || proto === null;
    }

    // otherwise, use internal class
    // this should be reliable as if getPrototypeOf not supported, is pre-ES5
    return Object.prototype.toString.call(obj) === '[object Object]';
}

export function toPlainObject(obj: any): any {
    const json = JSON.stringify(obj, (key: any, value: any) => value === undefined ? null : value);
    return JSON.parse(json);
}

export function clearProperties(obj: any): void {
    const keys = Object.keys(obj);
    for (let key of keys) {
        delete obj[key];
    }
}