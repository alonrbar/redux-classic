import { expect } from 'chai';
import { component, ignoreState, noDispatch, ReduxApp } from 'src';

// tslint:disable:no-unused-expression

describe(nameof(ignoreState), () => {

    it("non-decorated property exist both in the store and in the component tree", () => {

        @component
        class App {

            public value = 0;

            public increment() {
                this.value = this.value + 1;
            }
        }

        const app = new ReduxApp(new App());
        try {

            expect(app.root.value).to.eql(0);
            expect(app.store.getState().value).to.eql(0);

            app.root.increment();

            expect(app.root.value).to.eql(1);
            expect(app.store.getState().value).to.eql(1);

        } finally {
            app.dispose();
        }
    });

    it("decorated property exist only on the component tree (and not in the store)", () => {

        @component
        class App {

            @ignoreState
            public value = 0;

            public increment() {
                this.value = this.value + 1;
            }
        }

        const app = new ReduxApp(new App());
        try {

            expect(app.root.value).to.be.a('number');
            expect(app.store.getState().value).to.be.undefined;

            app.root.increment();

            expect(app.root.value).to.be.a('number');
            expect(app.store.getState().value).to.be.undefined;

        } finally {
            app.dispose();
        }
    });

    it("decorated property can not be manipulated through pure actions", () => {

        @component
        class App {

            @ignoreState
            public value = 0;

            public increment() {
                this.value = this.value + 1;
            }
        }

        const app = new ReduxApp(new App());
        try {

            expect(app.root.value).to.eql(0);
            expect(app.store.getState().value).to.be.undefined;

            app.root.increment();

            expect(app.root.value).to.eql(0);
            expect(app.store.getState().value).to.be.undefined;

        } finally {
            app.dispose();
        }
    });

    it("decorated property can be manipulated through noDispatch methods", () => {

        @component
        class App {

            @ignoreState
            public value = 0;

            @noDispatch
            public increment() {
                this.value = this.value + 1;
            }
        }

        const app = new ReduxApp(new App());
        try {

            expect(app.root.value).to.eql(0);
            expect(app.store.getState().value).to.be.undefined;

            app.root.increment();

            expect(app.root.value).to.eql(1);
            expect(app.store.getState().value).to.be.undefined;

        } finally {
            app.dispose();
        }
    });

});