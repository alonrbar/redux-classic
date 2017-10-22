import { expect } from 'chai';
import { component, noDispatch, ReduxApp } from 'src';

describe(nameof(noDispatch), () => {

    it("non-decorated method mutates the store state", () => {

        @component
        class App {
            
            public value = 0;

            public increment() {
                this.value = this.value + 1;
            }
        }
        const app = new ReduxApp(new App());
        app.root.increment();

        expect(app.store.getState().value).to.eql(1);
    });

    it("decorated method does not mutate the store state", () => {

        @component
        class App {
            public value = 0;

            @noDispatch
            public increment() {
                this.value = this.value + 1;
            }
        }
        const app = new ReduxApp(new App());
        app.root.increment();

        expect(app.store.getState().value).to.eql(0);
    });

});