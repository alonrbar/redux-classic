import { expect } from 'chai';
import { component, computed, connect, ReduxApp } from 'src';
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

        @component
        class App {
            public greeter = new ComputedGreeter();
            public connectedComputed = new ConnectedCompute();
        }

        class ConnectedCompute {

            @connect
            public linkToGreeter: ComputedGreeter;

            @computed
            public get upperCaseGreeting(): string {
                return this.linkToGreeter.welcomeString.toUpperCase();
            }
        }

        const app = new ReduxApp(new App());
        try {

            expect(app.root.greeter.welcomeString).to.eql('hello undefined');
            expect(app.root.connectedComputed.upperCaseGreeting).to.eql('HELLO UNDEFINED');

            app.root.greeter.setName('Alon');

            expect(app.root.greeter.welcomeString).to.eql('hello Alon');
            expect(app.root.connectedComputed.upperCaseGreeting).to.eql('HELLO ALON');

        } finally {
            app.dispose();
        }
    });

    it("computed values are not persisted on the store", () => {

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