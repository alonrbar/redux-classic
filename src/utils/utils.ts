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

export function getMethods(obj: object): IMap<Method> {
    if (!obj)
        return undefined;

    var proto = Object.getPrototypeOf(obj);
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

export function getType(obj: object): Function {
    return Object.getPrototypeOf(obj).constructor;
}

export function getParentType(obj: object | Function) {
    var type: Function;
    if (typeof obj === 'object') {
        type = getType(obj);
        
    } else if (typeof obj === 'function') {
        type = obj;
    }

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