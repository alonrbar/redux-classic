import { ClassInfo } from '../info';
import { dataDescriptor, deferredDefineProperty, transformDeep, TransformOptions } from '../utils';
import { Connect } from './connect';

/**
 * Property decorator.
 * Computed values are computed each time the store state is changed.
 */
export function computed(target: any, propertyKey: string | symbol): void {
    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);

    if (typeof descriptor.get !== 'function')
        throw new Error(`Failed to decorate '${propertyKey}'. The 'computed' decorator should only be used on getters.`);

    if (descriptor.set)
        throw new Error(`Failed to decorate '${propertyKey}'. Decorated property should not have a setter.`);

    // store getter for later
    const info = ClassInfo.getOrInitInfo(target);
    info.computedGetters[propertyKey] = descriptor.get;

    // and replace it with a simple data descriptor
    return deferredDefineProperty(target, propertyKey, dataDescriptor);
}

export class Computed {

    public static readonly placeholder = '<computed>';

    private static transformOptions: TransformOptions;

    public static isComputedProperty(propHolder: object, propKey: string | symbol): boolean {
        const info = ClassInfo.getInfo(propHolder);
        return info && (typeof info.computedGetters[propKey] === 'function');
    }

    /**
     * Returns a shallow clone of 'state' with it's computed props replaced with
     * Computed.placeholder.
     */
    public static removeComputedProps(state: any, obj: any): any {
        const info = ClassInfo.getInfo(obj);
        if (!info)
            return state;

        const newState = Object.assign({}, state);
        for (let propKey of Object.keys(info.computedGetters)) {
            newState[propKey] = Computed.placeholder;
        }
        return newState;
    }

    public static computeProps(root: any): void {
        if (!Computed.transformOptions) {
            const options = new TransformOptions();
            options.propertyPreTransform = (target, source, key) => !Connect.isConnectedProperty(target, key);
            Computed.transformOptions = options;
        }

        transformDeep(root, root, Computed.computeTargetProps, Computed.transformOptions);
    }

    /**
     * Replace each computed property of 'obj' with it's current computed value.
     */
    private static computeTargetProps(target: any, source: any): any {

        // obj may be a component or any other object
        const info = ClassInfo.getInfo(target);
        if (!info)
            return target;

        for (let propKey of Object.keys(info.computedGetters)) {

            // get old value
            var getter = info.computedGetters[propKey];
            var newValue = getter.call(target);

            // update if necessary
            var oldValue = target[propKey];
            if (newValue !== oldValue) {
                target[propKey] = newValue;
            }
        }

        return target;
    }
}