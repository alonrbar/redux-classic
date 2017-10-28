import { IMap, Method } from '../types';

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

export function getMethods(obj: object): IMap<Method> {
    if (!obj)
        return undefined;

    var proto = Object.getPrototypeOf(obj);
    if (!proto)
        return undefined;

    var methods: any = {};
    for (let key of Object.keys(proto)) {
        if (typeof proto[key] === 'function')
            methods[key] = proto[key];
    }

    return methods;
}

export function getProp<T = any>(obj: any, path: string | (string | number)[]): T {
    if (typeof path === 'string') {
        path = path.replace(/\[|\]/g, '.').split('.').filter(token => typeof token === 'string' && token.trim() !== '');
    }

    return path.reduce<T>((result: any, key: string) => {
        if (typeof result === 'object' && key) {
            return result[key.toString()];
        }

        return undefined;
    }, obj);
}

export function getConstructorProp(obj: object, key: symbol | string): any {
    return obj && obj.constructor && (obj.constructor as any)[key];
}

export const dataDescriptor: PropertyDescriptor = {
    writable: true,
    configurable: true,
    enumerable: true
};

export const accessorDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: true
};