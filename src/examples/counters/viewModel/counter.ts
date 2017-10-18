import { Counter } from "examples/counters/model/counter";
import { componentSchema } from "lib";

@componentSchema
export class CounterComponent {

    public counter = new Counter();

    public increment(counterId: number): void {

        if (counterId !== this.counter.id)
            return;

        const { value, ...rest } = this.counter;

        this.counter = {
            value: value + 1,
            ...rest
        }
    }
}