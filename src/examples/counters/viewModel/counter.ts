import { Counter } from 'examples/counters/model/counter';
import { component } from 'lib';

@component
export class CounterComponent {

    public counter = new Counter();

    public increment(counterId: number): void {

        if (counterId !== this.counter.id)
            return;

        const { value, ...rest } = this.counter;

        this.counter = {
            value: value + 1,
            ...rest
        };
    }
}