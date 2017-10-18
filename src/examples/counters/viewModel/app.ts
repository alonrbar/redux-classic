import { componentSchema } from 'lib';
import { CounterComponent } from './counter';

@componentSchema
export class App {
    public message = "redux-app";
    public counter1 = new CounterComponent();
    public counter2 = new CounterComponent();

    public increment() {
        console.log('increment me too!')
    }
}