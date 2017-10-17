import { combineReducers, Reducer, ReducersMapObject, Store } from 'redux';
import { Component } from './component';
import { COMPONENT_CREATOR, ComponentSchema, isComponentSchema } from './componentSchema';

export interface IComponentSchemaTree {
    [key: string]: ComponentSchema<any> | IComponentSchemaTree;
}

function isComponentSchemaTree(obj: any): obj is IComponentSchemaTree {
    return Object.keys(obj).length !== 0;
}

export type ComponentTreeCreator = any;

export class ComponentTree {

    public component: Component<any, any>;
    public children: { [key: string]: ComponentTree; };

    constructor(store: Store<any>, schema: ComponentTreeCreator) {

        if (isComponentSchema(schema)) {
            this.createSelf(store, schema);
        } else if (isComponentSchemaTree(schema)) {
            this.createChildren(store, schema);
        }

        if (!this.component && !this.children)
            throw new Error(`Invalid ${nameof(schema)}. ${nameof(ComponentTree)} initialization failed.`)
    }

    public getReducer(): Reducer<any> {
        if (this.component) {
            return this.component.reducer;
        } else {
            const result: ReducersMapObject = {};
            for (let key of Object.keys(this.children)) {
                result[key] = this.children[key].getReducer();
            }
            return combineReducers(result);
        }
    }

    public getState(): any {

        var selfState: any = {};
        if (this.component)
            selfState = this.component.state;

        var childrenState: any = {};
        if (this.children) {
            Object.keys(this.children).forEach(key => {
                childrenState[key] = this.children[key].getState();
            })
        }

        return {
            ...selfState,
            ...childrenState
        };
    }

    private createSelf(store: Store<any>, schema: ComponentSchema<any>): void {
        this.component = new Component(store.dispatch, schema);
    }

    private createChildren(store: Store<any>, schema: IComponentSchemaTree): void {
        this.children = {};
        for (let key of Object.keys(schema)) {
            let subTree = new ComponentTree(store, schema[key]);
            if (subTree !== null)
                this.children[key] = subTree;
        }
    }
}