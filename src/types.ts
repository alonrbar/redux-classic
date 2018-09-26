// tslint:disable:ban-types interface-name

export type Method = Function;

export type Getter = () => any;

export interface Constructor<T> {
    new(...args: any[]): T;
}

export interface IMap<T> { 
    [key: string]: T;
}

export type Listener<T = any> = (arg?: T) => void;

export declare type ResolverKey<T> = Constructor<T> | symbol;

export interface IResolver {
    get<T>(key: ResolverKey<T>, params?: any): T;
}