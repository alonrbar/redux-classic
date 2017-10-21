import { Component } from '../components';

export interface INewable<T> { 
    new(...args: any[]): T; 
}

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
    <T>(target: Component<T>): void;
}