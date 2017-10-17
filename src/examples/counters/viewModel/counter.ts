import { Counter } from "examples/counters/model/counter";
import { componentSchema } from "lib";

@componentSchema
export class CounterComponent {

    public counter = new Counter();

    public increment(counterId = this.counter.id): void {

        if (counterId !== this.counter.id)
            return;

        const { value, id } = this.counter;

        this.counter = {
            id,
            value: value + 1
        }
    }
}