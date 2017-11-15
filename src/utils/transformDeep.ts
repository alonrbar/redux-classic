import { isPrimitive } from './utils';

type ObjectTransformer = (target: object, source: object) => object;

export function transformDeep(target: any, source: any, callback: ObjectTransformer, visited = new Set()): any {

    // not traversing primitives
    if (isPrimitive(target) || isPrimitive(source))
        return target;

    // prevent endless loops on circular references
    if (visited.has(source))
        return source;
    visited.add(source);

    // transform children
    Object.keys(target).forEach(key => {

        // transform child
        var subTarget = target[key];
        var subSource = source[key];
        var newSubTarget = transformDeep(subTarget, subSource, callback, visited);

        // assign only if changed
        if (newSubTarget !== subTarget) {
            target[key] = newSubTarget;
        }
    });

    // invoke on self
    return callback(target, source);
}