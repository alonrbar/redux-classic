import { Component } from '../components';
import { ComponentInfo, CreatorInfo } from '../info';
import { dataDescriptor, log } from '../utils';

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

    // delete the accessor descriptor
    delete target[propertyKey];

    // and replace it with a data descriptor
    Object.defineProperty(target, propertyKey, dataDescriptor);

    // store getter for later
    const info = CreatorInfo.getOrInitInfo(target);
    info.computedGetters[propertyKey] = descriptor.get;
}

export class Computed {

    public static readonly placeholder = '<computed>';

    public static setupComputedProps(component: Component, creatorInfo: CreatorInfo, compInfo: ComponentInfo): void {

        // delete real props
        for (let propKey of Object.keys(creatorInfo.computedGetters)) {
            delete (component as any)[propKey];
        }

        // store getters
        compInfo.computedGetters = creatorInfo.computedGetters;
    }

    /**
     * Returns a shallow clone of 'state' with it's computed props replaced with
     * Computed.placeholder.
     */
    public static removeComputedProps(state: any, obj: any): any {

        // obj may be a component or any other object
        const info = ComponentInfo.getInfo(obj);
        if (!info)
            return state;

        const newState = Object.assign({}, state);
        for (let propKey of Object.keys(info.computedGetters)) {
            newState[propKey] = Computed.placeholder;
        }
        return newState;
    }

    /**
     * Returns a shallow clone of 'state' with it's computed props assigned from 'obj'.
     */
    public static restoreComputedProps(state: any, obj: any): any {

        // obj may be a component or any other object
        const info = ComponentInfo.getInfo(obj);
        if (!info)
            return state;

        const newState = Object.assign({}, state);
        for (let propKey of Object.keys(info.computedGetters)) {
            newState[propKey] = obj[propKey];
        }
        return newState;
    }

    /**
     * Replace each computed property of 'obj' with it's current computed value.
     */
    public static computeProps(obj: any): void {

        // obj may be a component or any other object
        const info = ComponentInfo.getInfo(obj);
        if (!info)
            return;

        for (let propKey of Object.keys(info.computedGetters)) {

            // get old value
            var getter = info.computedGetters[propKey];
            log.verbose(`[computeProps] computing new value of '${propKey}'`);
            var newValue = getter.call(obj);

            // update if necessary
            var oldValue = obj[propKey];
            if (newValue !== oldValue) {
                log.verbose(`[computeProps] updating the state of '${propKey}'. New value: '${newValue}', Old value: '${oldValue}'.`);
                obj[propKey] = newValue;
            }
        }
    }
}