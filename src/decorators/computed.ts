import { setSymbol, getSymbol, COMPUTED } from '../symbols';
import { Reducer, AnyAction } from 'redux';
import { Component } from '../components';
import { log } from '../utils';

const dataDescriptor: PropertyDescriptor = {
    writable: true,
    configurable: true,
    enumerable: true
};

/**
 * Computed values are computed each time the store state is changed. They are
 * NOT STORED IN THE STORE but only on the component state. If you want to
 * change the state of the store you should dispatch an action using a component
 * method.
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
    const computedGetters = getSymbol(target, COMPUTED) || {};
    computedGetters[propertyKey] = descriptor.get;
    setSymbol(target, COMPUTED, computedGetters);
}

export function reducerWithComputed(reducer: Reducer<any>, obj: object): Reducer<any> {
    return (state: any, action: AnyAction) => {
        const newState = reducer(state, action);
        computeProps(obj, newState);
        return newState;
    };
}

export function addComputed(component: Component<any>, schema: object): void {
    const computedGetters = getSymbol(schema, COMPUTED);
    if (!computedGetters)
        return;

    // delete real props
    for (let propKey of Object.keys(computedGetters)) {
        delete (component as any)[propKey];
    }

    // store symbols data
    setSymbol(component, COMPUTED, computedGetters);
}

function computeProps(schema: object, state: any): void {
    const computedGetters = getSymbol(schema, COMPUTED);
    if (!computedGetters)
        return;

    for (let propKey of Object.keys(computedGetters)) {
        
        // get old value
        var getter = computedGetters[propKey];
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