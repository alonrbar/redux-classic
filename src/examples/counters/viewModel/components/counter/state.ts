import { Counter } from "examples/counters/model/counter";

export class CounterComponentState {
    public counter = new Counter();

    constructor() {
        console.log('CounterComponentState created')
    }
}