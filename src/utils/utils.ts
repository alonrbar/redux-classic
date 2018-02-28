import { isSymbol } from '../symbols';
import { IMap, Method } from '../types';

// tslint:disable:ban-types

export function clearProperties(obj: any): void {
    const keys = Object.keys(obj);
    for (let key of keys) {
        delete obj[key];
    }
}

export enum DescriptorType {
    None = "None",
    Field = "Field",
    /** 
     * Properties with getter.
     */
    Property = "Property",
    Method = "Method"
}

/**
 * Get own and inherited property descriptor (except those of Object).
 */
export function getAllPropertyDescriptors(obj: any, descriptorTypes?: DescriptorType[]): IMap<PropertyDescriptor> {
    const result: IMap<PropertyDescriptor> = {};

    while (obj.constructor !== Object) {

        // get descriptor of current type
        let descriptors: IMap<PropertyDescriptor> = Object.getOwnPropertyDescriptors(obj);

        // filter by descriptor type
        if (descriptorTypes && descriptorTypes.length) {
            const filteredDescriptors: IMap<PropertyDescriptor> = {};

            for (const key of Object.keys(descriptors)) {
                for (const flag of descriptorTypes) {
                    let shouldAdd = false;
                    switch (flag) {
                        case DescriptorType.None:
                            break;
                        case DescriptorType.Field:
                            shouldAdd = (typeof descriptors[key].value !== 'function' && typeof descriptors[key].get !== 'function');
                            break;
                        case DescriptorType.Property:
                            shouldAdd = (typeof descriptors[key].get === 'function');
                            break;
                        case DescriptorType.Method:
                            shouldAdd = (typeof descriptors[key].value === 'function' && typeof descriptors[key].get !== 'function');
                            break;
                        default:
                            throw new Error("Property flag not supported: " + flag);
                    }

                    if (shouldAdd)
                        filteredDescriptors[key] = descriptors[key];
                }
            }

            descriptors = filteredDescriptors;
        }

        // store in result
        Object.assign(result, descriptors);

        // repeat with prototype
        obj = getPrototype(obj);
    }

    // a "constructor" property is always retrieved as part of the result
    if (result.constructor)
        delete result.constructor;

    return result;
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
 * @param obj 
 * @param bind Whether or not to bind the returned methods to 'obj'. Default value: false.
 */
export function getMethods(obj: object | Function, bind = false): IMap<Method> {
    const methodDescriptors = getAllPropertyDescriptors(obj, [DescriptorType.Method]);
    const methods: IMap<Method> = {};
    for (const key of Object.keys(methodDescriptors)) {
        methods[key] = methodDescriptors[key].value;
        if (bind) {
            methods[key] = methods[key].bind(obj);
        }
    }
    return methods;
}

export function assignProperties(target: object, source: object, descriptorTypes?: DescriptorType[]): object {
    const descriptors = getAllPropertyDescriptors(source, descriptorTypes);
    for (const key of Object.keys(descriptors)) {
        Object.defineProperty(target, key, descriptors[key]);
    }
    return target;
}

export function getParentType(obj: object | Function): Function {

    // get own type
    var type = getType(obj);

    // get parent type
    return Object.getPrototypeOf(type.prototype).constructor;
}

export function getPrototype(obj: object | Function): object {
    if (typeof obj === 'object') {
        return Object.getPrototypeOf(obj);
    } else if (typeof obj === 'function') {
        return obj.prototype;
    } else {
        throw new Error("Expected an object or a function. Got: " + obj);
    }
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