import { Component } from '../components';
import { ClassInfo } from '../info';
import { globalOptions } from '../options';
import { IMap } from '../types';
import { dataDescriptor, deferredDefineProperty } from '../utils';
var isEqual = require('lodash.isequal');

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

    public static isComputedProperty(propHolder: object, propKey: string | symbol): boolean {
        const info = ClassInfo.getInfo(propHolder);
        return info && (typeof info.computedGetters[propKey] === 'function');
    }

    /**
     * Returns a shallow clone of 'state' with it's computed props replaced with
     * Computed.placeholder.
     */
    public static removeComputedProps(state: any, obj: any, computedProps: IMap<any>): any {
        const info = ClassInfo.getInfo(obj);
        if (!info)
            return state;

        // populate output parameter
        Object.assign(computedProps, info.computedGetters);

        // remove computed props
        const newState = Object.assign({}, state);
        for (let propKey of Object.keys(info.computedGetters)) {
            newState[propKey] = Computed.placeholder;
        }
        return newState;
    }

    public static filterComponents(components: Component[]): Component[] {
        return components.filter(comp => {
            const info = ClassInfo.getInfo(comp);
            return info && Object.keys(info.computedGetters);
        });
    }

    public static computeProps(components: Component[]): void {
        for (let comp of components) {
            this.computeObjectProps(comp);
        }
    }

    /**
     * Replace each computed property of 'obj' with it's current computed value.
     */
    private static computeObjectProps(obj: any): void {

        const info = ClassInfo.getInfo(obj);
        if (!info)
            return;

        for (let propKey of Object.keys(info.computedGetters)) {

            // get old value
            var getter = info.computedGetters[propKey];
            var newValue = getter.call(obj);

            // update if necessary
            var oldValue = obj[propKey];
            if (newValue !== oldValue && (!globalOptions.computed.deepComparison || !isEqual(newValue, oldValue))) {
                obj[propKey] = newValue;
            }
        }
    }
}