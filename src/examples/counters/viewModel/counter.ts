import { Counter } from "examples/counters/model/counter";

export class CounterComponent {
    public counter = new Counter();

    constructor() {
        console.log('CounterComponentState created')
    }

    public static actions = (state = new CounterComponent()) => ({
        INCREMENT: (counterId: number) => {
            if (counterId !== state.counter.id){
                console.log(state.counter.id);
                return state;
            }
    
            const { value, id } = state.counter;
            return {
                counter: {
                    id,
                    value: value + 1
                }
            }
        }
    });
}