// tslint:disable:ban-types

export type Method = Function;

export type Getter = () => any;

export interface Constructor<T> {
    new(...args: any[]): T;
}

export interface IMap<T> { 
    [key: string]: T;
}

export type Listener<T = any> = (arg?: T) => void;