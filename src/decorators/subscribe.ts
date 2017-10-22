import { Component } from '../components';

export interface ISubscribe {
    /**
     * Method decorator.
     * Subscribe to changes of the decorated component.
     */
    (target: any, propertyKey: string | symbol): void;
    /**
     * Function.
     * Subscribe to changes of a specific component.
     */
    <T extends object>(target: Component<T>): void;
}