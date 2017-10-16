import { combineReducers, Reducer, ReducersMapObject, Store } from 'redux';
import { Component } from './component';
import { COMPONENT_CREATOR, ComponentSchema, IComponentSchemaTree } from './componentSchema';

export type ComponentTreeCreator = IComponentSchemaTree | ComponentSchema<any, any>;

export class ComponentTree {

    public component: Component<any, any>;
    public children: { [key: string]: ComponentTree; } = {}

    constructor(store: Store<any>, schema: ComponentTreeCreator) {

        if (schema instanceof ComponentSchema) {
            this.createSelf(store, schema);
        } else if (typeof schema === 'object') {
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

    private createSelf(store: Store<any>, schema: ComponentSchema<any, any>): void {
        this.component = new Component(store.dispatch, schema);
    }

    private createChildren(store: Store<any>, schema: IComponentSchemaTree): void {
        for (let key of Object.keys(schema)) {
            let subTree = new ComponentTree(store, schema[key]);
            if (subTree !== null)
                this.children[key] = subTree;
        }
    }
}