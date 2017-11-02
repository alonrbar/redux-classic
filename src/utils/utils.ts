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

export function pathString(path: string[]): string {
    if (path.length) {
        return `root.${path.join('.')}`;
    } else {
        return 'root';
    }
}