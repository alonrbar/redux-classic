
export class RecursionContext {
    public visited = new Set();
    public path = 'root';

    constructor(initial?: Partial<RecursionContext>) {
        Object.assign(this, initial);
    }
}