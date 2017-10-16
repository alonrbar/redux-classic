import { createCounter } from "examples/counters/viewModel/counterComponent/counterComponentActions";

export const appCreator = {
    counter1: createCounter(),
    counter2: createCounter()
}