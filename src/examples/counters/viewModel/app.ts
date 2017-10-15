import { counterAutoCreate } from "examples/counters/viewModel/counterComponent/counterComponentActions";

export const appCreator = {
    counter1: counterAutoCreate(),
    counter2: counterAutoCreate()
}