import { Dispatch, Reducer } from 'redux';
import { COMPONENT_META, getSymbol, setSymbol } from '../symbols';
import { Getter, IDisposable, IMap } from '../types';
import { Component } from './component';

// tslint:disable:ban-types

/**
 * Metadata stored on each component instance.
 */
export class Metadata {

    public static getMeta(component: Component): Metadata {
        return getSymbol(component, COMPONENT_META);
    }

    public static createMeta(component: Component): Metadata {
        return setSymbol(component, COMPONENT_META, new Metadata());
    }

    public id: any;    
    public originalClass: Function;
    public dispatch: Dispatch<any>;
    public reducer: Reducer<any>;
    public disposables: IDisposable[] = [];
    public computedGetters: IMap<Getter>;
}