// tslint:disable-next-line:ban-types
export type Method = Function;

export type Getter = () => any;

export interface IMap<T> { 
    [key: string]: T;
}

export type Listener<T = any> = (arg?: T) => void;