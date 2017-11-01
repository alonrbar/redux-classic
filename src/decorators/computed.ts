import { AnyAction, Reducer } from 'redux';
import { Component, ComponentInfo, CreatorInfo } from '../components';
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

    public static wrapReducer(reducer: Reducer<any>, obj: object): Reducer<any> {
        return (state: any, action: AnyAction) => {
            const newState = reducer(state, action);
            Computed.computeProps(obj, newState);
            return newState;
        };
    }

    public static setupComputedProps(component: Component, schema: CreatorInfo, meta: ComponentInfo): void {

        // delete real props
        for (let propKey of Object.keys(schema.computedGetters)) {
            delete (component as any)[propKey];
        }

        // store getters
        meta.computedGetters = schema.computedGetters;
    }

    private static computeProps(obj: object, state: any): void {

        // obj may be a component or any other object
        const info = ComponentInfo.getInfo(obj as any);
        if (!info)
            return;

        for (let propKey of Object.keys(info.computedGetters)) {

            // get old value
            var getter = info.computedGetters[propKey];
            log.verbose(`[computeProps] computing new value of '${propKey}'`);
            var newValue = getter.call(state);

            // update if necessary
            var oldValue = state[propKey];
            if (newValue !== oldValue) {
                log.verbose(`[computeProps] updating the state of '${propKey}'. New value: '${newValue}', Old value: '${oldValue}'.`);
                state[propKey] = newValue;
            }
        }
    }
}