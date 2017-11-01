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

export function pathString(path: string[]): string {
    if (path.length) {
        return `root.${path.join('.')}`;
    } else {
        return 'root';
    }
}

/**
 * Copy all properties, including getters, setters and properties with initial undefined value.
 */
export function copyProperties(target: object, source: object) {
    for (let key of Object.getOwnPropertyNames(source)) {
        var desc = Object.getOwnPropertyDescriptor(source, key);
        if (desc) {
            Object.defineProperty(target, key, desc);
        } else {
            (target as any)[key] = (source as any)[key];
        }
    }
}

export function getPropertyNames(obj: any) {
    
    // undefined properties only exist on the prototype
    var protoProps = Object.getOwnPropertyNames(Object.getPrototypeOf(obj));
    var ownProps = Object.getOwnPropertyNames(obj);    

    for (let propKey of protoProps) {

        // ignore constructor
        if (propKey === 'constructor')
            continue;

        // ignore methods
        var desc = Object.getOwnPropertyDescriptor(obj, propKey);
        if (!desc && typeof obj[propKey] === 'function')
            continue;

        // avoid duplicates
        if (ownProps.includes(propKey))
            continue;

        ownProps.push(propKey);
    }

    return ownProps;
}