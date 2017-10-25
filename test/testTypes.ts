import { Store, Unsubscribe } from 'redux';

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