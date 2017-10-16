import { combineReducers, Reducer, ReducersMapObject, Store } from 'redux';
import { createReducer } from '../reducers';
import { Component } from './component';
import { ICreatorsMap, ComponentCreator, COMPONENT_CREATOR } from './componentCreator';

export interface IComponentTree {
    [key: string]: Component<any, any> | IComponentTree;
}

export function createTree(store: Store<any>, map: ICreatorsMap | ComponentCreator<any, any>): IComponentTree | Component<any, any> {

    if (typeof map === 'object') {
        var resultTree: IComponentTree = {};
        for (let key of Object.keys(map)) {
            let subTree = createTree(store, map[key] as any);
            if (subTree !== null)
                resultTree[key] = subTree;
        }
        return resultTree;

    } else if (typeof map === 'function') {
        if ((map as any)[COMPONENT_CREATOR]) {
            return new Component(store, map);
        } else {
            throw new Error("Invalid argument 'map'. Function is not a component creator. Did you forget to call 'createComponent' or to invoke the creator?")
        }

    } else {
        throw new Error("Invalid argument 'map'. Must be an object or a function.")
    }
}

export function getReducer(component: IComponentTree | Component<any, any>): Reducer<any> {
    if (component instanceof Component) {
        return component.reducer;
    } else {
        const result: ReducersMapObject = {};
        for (let key of Object.keys(component)) {
            result[key] = getReducer(component[key]);
        }
        return combineReducers(result);
    }
}