import { computed, component, ReduxApp } from 'src';
import { expect } from 'chai';

// tslint:disable:no-unused-expression

describe(nameof(computed), () => {

    @component
    class ComputedGreeter {
        public name: string;

        @computed
        public get welcomeString(): string {
            return 'hello ' + this.name;
        }

        public setName(newVal: string) {
            this.name = newVal;
        }
    }

    it("persists initial value on the store", () => {

        const app = new ReduxApp(new ComputedGreeter());

        expect(app.store.getState().welcomeString).to.equal('hello undefined');

        app.dispose();
    });

    it("persists initial value on the store (nested)", () => {

        @component
        class Root {
            public first = {
                second: new Second()
            };
        }

        class Second {
            public third = new ComputedGreeter();
        }

        const app = new ReduxApp(new Root());

        expect(app.store.getState().first.second.third.welcomeString).to.equal('hello undefined');

        app.dispose();
    });

    it("persists the computed value on the store", () => {

        const app = new ReduxApp(new ComputedGreeter());

        // assert before
        expect(app.store.getState().welcomeString).to.equal('hello undefined');

        // assert after
        app.root.setName('Alon');
        expect(app.store.getState().welcomeString).to.equal('hello Alon');

        app.dispose();
    });

    it("persists the computed value on the store (nested)", () => {

        @component
        class Root {
            public first = {
                second: new Second()
            };
        }

        class Second {
            public third = new ComputedGreeter();
        }

        const app = new ReduxApp(new Root());

        // assert before
        expect(app.store.getState().first.second.third.welcomeString).to.equal('hello undefined');

        // assert after
        app.root.first.second.third.setName('Alon');
        expect(app.store.getState().first.second.third.welcomeString).to.equal('hello Alon');

        app.dispose();
    });
});