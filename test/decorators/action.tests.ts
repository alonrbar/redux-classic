import { expect } from 'chai';
import { action, ReduxApp } from 'src';

// tslint:disable:no-unused-expression

describe(nameof(action), () => {

    it("decorated method dispatches an action", () => {

        class App {

            public value = 0;

            @action
            public increment() {
                this.value = this.value + 1;
            }
        }

        var dispatched = false;

        const app = new ReduxApp(new App());
        app.store.subscribe(() => dispatched = true);

        app.root.increment();
        expect(dispatched).to.be.true;

        app.dispose();
    });

    it("non-decorated method does not dispatch an action", () => {

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
        expect(dispatched).to.be.false;

        app.dispose();
    });

});