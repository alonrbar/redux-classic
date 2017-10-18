import { CounterComponent } from "./counter";
import { componentSchema } from "lib";

@componentSchema
export class App {
    public message = "redux-app";
    public counter1 = new CounterComponent();
    public counter2 = new CounterComponent();
}