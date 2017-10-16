import { CounterComponentState } from "./state";

export const counterComponentActions = (state: CounterComponentState) => ({
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
const actions = counterComponentActions(undefined);
export type CounterComponentActions = typeof actions;