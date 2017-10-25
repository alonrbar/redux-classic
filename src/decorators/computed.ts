import { AnyAction, Reducer } from 'redux';
import { Component, Metadata, Schema } from '../components';
import { log } from '../utils';

const dataDescriptor: PropertyDescriptor = {
    writable: true,
    configurable: true,
    enumerable: true
};

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
    const schema = Schema.getOrCreateSchema(target);
    schema.computedGetters[propertyKey] = descriptor.get;
}

export class Computed {

    public static wrapReducer(reducer: Reducer<any>, obj: object): Reducer<any> {
        return (state: any, action: AnyAction) => {
            const newState = reducer(state, action);
            Computed.computeProps(obj, newState);
            return newState;
        };
    }

    public static setupComputedProps(component: Component, schema: Schema, meta: Metadata): void {

        // delete real props
        for (let propKey of Object.keys(schema.computedGetters)) {
            delete (component as any)[propKey];
        }

        // store getters
        meta.computedGetters = schema.computedGetters;
    }

    private static computeProps(obj: object, state: any): void {

        // obj may be a component or any other object
        const meta = Metadata.getMeta(obj as any);
        if (!meta)
            return;

        for (let propKey of Object.keys(meta.computedGetters)) {

            // get old value
            var getter = meta.computedGetters[propKey];
            log.verbose(`[computeProps] computing new value of '${propKey}'`);
            var newValue = getter.call(state);

            // update if necessary
            var oldValue = state[propKey];
            if (newValue !== oldValue) {
                log.verbose(`[computeProps] updating the state of '${propKey}'. New value: '${newValue}', Old value: '${oldValue}'.`);
                delete state[propKey];
                state[propKey] = newValue;
            }
        }
    }
}