import { expect } from 'chai';
import { component, noDispatch, ReduxApp } from 'src';

// tslint:disable:no-unused-expression

describe(nameof(noDispatch), () => {

    it("non-decorated method dispatches an action", () => {

        @component
        class App {

            public value = 0;

            public increment() {
                this.value = this.value + 1;
            }
        }

        var dispatched = false;

        const app = new ReduxApp(new App());
        app.store.subscribe(() => dispatched = true);

        app.root.increment();
        expect(dispatched).to.be.true;
    });

    it("decorated method does not dispatch an action", () => {

        @component
        class App {
            public value = 0;

            @noDispatch
            public increment() {
                this.value = this.value + 1;
            }
        }

        var dispatched = false;

        const app = new ReduxApp(new App());
        app.store.subscribe(() => dispatched = true);

        app.root.increment();
        expect(dispatched).to.be.false;
    });

});