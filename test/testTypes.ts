import { component } from 'src';
import { Store, Unsubscribe } from 'redux';

@component
export class Counter {
    public value = 0;
    public increment() {
        this.value = this.value + 1;
    }
}

export class FakeStore implements Store<any> {
    public dispatch(): any {
        return () => { /* noop */ };
    }
    public getState(): any {
        return {};
    }

    public subscribe(): Unsubscribe {
        return () => { /* noop */ };
    }
    public replaceReducer(): void {
        /* noop */
    }
}