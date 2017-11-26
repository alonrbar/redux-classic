import { Component } from './component';
import { IMap } from '../types';

export class RecursionContext {
    public visited = new Set();
    public path = 'root';
    public components: IMap<Component> = {};

    constructor(initial?: Partial<RecursionContext>) {
        Object.assign(this, initial);
    }
}