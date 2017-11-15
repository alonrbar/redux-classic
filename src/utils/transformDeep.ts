import { isPrimitive } from './utils';

type ObjectTransformer = (target: object, source: object) => object;

type PropertyPreTransformer = (target: object, source: object, key: string | symbol) => boolean;

export class TransformOptions {

    /**
     * Return false to prevent further transformation of the property.
     */
    public propertyPreTransform: PropertyPreTransformer;
}

export function transformDeep(target: any, source: any, callback: ObjectTransformer, options = new TransformOptions(), visited = new Set()): any {

    // not traversing primitives
    if (isPrimitive(target) || isPrimitive(source))
        return target;

    // prevent endless loops on circular references
    if (visited.has(source))
        return source;
    visited.add(source);

    // transform children
    Object.keys(target).forEach(key => {

        if (options.propertyPreTransform && (options.propertyPreTransform(target, source, key) === false))
            return;

        // transform child
        var subTarget = target[key];
        var subSource = source[key];
        var newSubTarget = transformDeep(subTarget, subSource, callback, options, visited);

        // assign only if changed
        if (newSubTarget !== subTarget) {
            target[key] = newSubTarget;
        }
    });

    // invoke on self
    return callback(target, source);
}