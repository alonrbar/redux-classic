import { expect } from 'chai';
import { component, computed, ReduxApp } from 'src';
import { Computed } from 'src/decorators';

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

    it("computes initial value", () => {

        const app = new ReduxApp(new ComputedGreeter());
        try {
            expect(app.root.welcomeString).to.equal('hello undefined');
        } finally {
            app.dispose();
        }
    });

    it("computes nested initial value", () => {

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

        try {
            expect(app.root.first.second.third.welcomeString).to.equal('hello undefined');
        } finally {
            app.dispose();
        }
    });

    it("computes a value", () => {

        const app = new ReduxApp(new ComputedGreeter());
        try {

            // assert before
            expect(app.root.welcomeString).to.equal('hello undefined');

            // assert after
            app.root.setName('Alon');
            expect(app.root.welcomeString).to.equal('hello Alon');

        } finally {
            app.dispose();
        }
    });

    it("computes a nested value", () => {

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
        try {

            // assert before
            expect(app.root.first.second.third.welcomeString).to.equal('hello undefined');

            // assert after
            app.root.first.second.third.setName('Alon');
            expect(app.root.first.second.third.welcomeString).to.equal('hello Alon');

        } finally {
            app.dispose();
        }
    });

    it("computing from connected components inside the app works", () => {
        throw new Error("TODO");
    });

    it("computed values are not stored in the store", () => {

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
        try {

            // assert before
            expect(app.root.first.second.third.welcomeString).to.equal('hello undefined');
            expect(app.store.getState().first.second.third.welcomeString).to.equal(Computed.placeholder);

            // assert after
            app.root.first.second.third.setName('Alon');
            expect(app.root.first.second.third.welcomeString).to.equal('hello Alon');
            expect(app.store.getState().first.second.third.welcomeString).to.equal(Computed.placeholder);

        } finally {
            app.dispose();
        }
    });
});