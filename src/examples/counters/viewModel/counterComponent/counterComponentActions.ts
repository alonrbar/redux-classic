import { CounterComponentState } from "./counterComponentState";
import { automatonCreator } from "lib/automatonCreator";

export const counterAutoCreate = automatonCreator((state: CounterComponentState) => ({
    INCREMENT: () => {
        const { value } = state.counter;
        return {
            counter: {
                value: value + 1
            }    
        }
    }
}));