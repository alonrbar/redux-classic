import { customElement, bindable } from "aurelia-framework";
import { Counter } from "../model/counter";

@customElement('counter')
export class CounterElement {
    @bindable public counter: Counter;
    @bindable public increment: Function;
}