import { CounterComponent } from "./counter";
import { componentSchema } from "lib";

@componentSchema
export class App {
    public counter1 = new CounterComponent();
    public counter2 = new CounterComponent();
}