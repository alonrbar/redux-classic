import { expect } from 'chai';
import { component, connect, ReduxApp, withId } from 'src';
import { Component } from 'src/components';

// tslint:disable:no-unused-expression

describe(nameof(connect), () => {

    it("creates only one source component for multiple connected components", () => {

        @component
        class App {
            public source = new MyComponent();
        }

        @component
        class MyComponent {
        }

        class Page1 {
            @connect
            public linkToSource: MyComponent;
        }

        class Page2 {
            @connect
            public linkToSource: MyComponent;
        }

        // create some view models
        const page1 = new Page1();
        const page2 = new Page2();

        expect(page1.linkToSource).to.be.undefined;

        // create the app
        const app = new ReduxApp(new App());
        try {

            // assert number of sources
            const warehouse = app.getTypeWarehouse(MyComponent);
            expect(warehouse.size).to.eql(1);

            // assert reference
            expect(page1.linkToSource).to.equal(app.root.source);
            expect(page2.linkToSource).to.equal(app.root.source);

            // assert no getter side effects
            expect(warehouse.size).to.eql(1);

        } finally {
            app.dispose();
        }
    });

    it("creates a connection between a component inside the default app and a component outside of it", () => {

        @component
        class App {
            public comp = new MyComponent();

        }

        @component
        class MyComponent {
            public value = 0;

            public increment() {
                this.value = this.value + 1;
            }
        }

        class Page {
            @connect
            public connectMe: MyComponent;
        }

        // create some view model
        const page = new Page();

        expect(page.connectMe).to.be.undefined;

        // create the app
        const plainApp = new App();

        expect(page.connectMe).to.be.undefined;
        expect(plainApp.comp.value).to.eql(0);

        // elevate the app
        const reduxApp = new ReduxApp(plainApp);
        try {

            // assert connected
            expect(page.connectMe).to.equal(reduxApp.root.comp);

            // assert existence
            expect(reduxApp.root.comp).to.be.instanceOf(Component);
            expect(reduxApp.root.comp.value).to.eql(0);

            // assert action works
            reduxApp.root.comp.increment();
            expect(page.connectMe.value).to.eql(1);

        } finally {
            reduxApp.dispose();
        }
    });

    it("creates a connection between a component inside a named app and a component outside of it", () => {

        const testAppName = 'connect-test-1';

        @component
        class App {
            public comp = new MyComponent();

        }

        @component
        class MyComponent {
            public value = 0;

            public increment() {
                this.value = this.value + 1;
            }
        }

        class Page {
            @connect({ app: testAppName })
            public connectMe: MyComponent;
        }

        // create some view model
        const page = new Page();

        expect(page.connectMe).to.be.undefined;

        // create the app
        const plainApp = new App();

        expect(page.connectMe).to.be.undefined;
        expect(plainApp.comp.value).to.eql(0);

        // elevate the app
        const reduxApp = new ReduxApp(plainApp, { name: testAppName });
        try {

            // assert connected
            expect(page.connectMe).to.equal(reduxApp.root.comp);

            // assert existence
            expect(reduxApp.root.comp).to.be.instanceOf(Component);
            expect(reduxApp.root.comp.value).to.eql(0);

            // assert action works
            reduxApp.root.comp.increment();
            expect(page.connectMe.value).to.eql(1);

        } finally {
            reduxApp.dispose();
        }
    });

    it("creates a connection between a component inside the default app and a component outside of it - with id", () => {

        const compId = 'my-id';

        @component
        class App {
            @withId(compId)
            public comp = new MyComponent();
        }

        @component
        class MyComponent {
            public value = 0;

            public increment() {
                this.value = this.value + 1;
            }
        }

        class Page {
            @connect({ id: compId })
            public connectMe: MyComponent;
        }

        // create some view model
        const page = new Page();

        expect(page.connectMe).to.be.undefined;

        // create the app
        const plainApp = new App();

        expect(page.connectMe).to.be.undefined;
        expect(plainApp.comp.value).to.eql(0);

        // elevate the app
        const reduxApp = new ReduxApp(plainApp);
        try {

            // assert connected
            expect(page.connectMe).to.equal(reduxApp.root.comp);

            // assert existence
            expect(reduxApp.root.comp).to.be.instanceOf(Component);
            expect(reduxApp.root.comp.value).to.eql(0);

            // assert action works
            reduxApp.root.comp.increment();
            expect(page.connectMe.value).to.eql(1);

        } finally {
            reduxApp.dispose();
        }
    });

    it("creates a connection between a component inside a named app and a component outside of it - with id", () => {

        const testAppName = 'connect-test-3';
        const compId = 'my-id';

        @component
        class App {
            @withId(compId)
            public comp = new MyComponent();
        }

        @component
        class MyComponent {
            public value = 0;

            public increment() {
                this.value = this.value + 1;
            }
        }

        class Page {
            @connect({ app: testAppName, id: compId })
            public connectMe: MyComponent;
        }

        // create some view model
        const page = new Page();

        expect(page.connectMe).to.be.undefined;

        // create the app
        const plainApp = new App();

        expect(page.connectMe).to.be.undefined;
        expect(plainApp.comp.value).to.eql(0);

        // elevate the app
        const reduxApp = new ReduxApp(plainApp, { name: testAppName });
        try {

            // assert connected
            expect(page.connectMe).to.equal(reduxApp.root.comp);

            // assert existence
            expect(reduxApp.root.comp).to.be.instanceOf(Component);
            expect(reduxApp.root.comp.value).to.eql(0);

            // assert action works
            reduxApp.root.comp.increment();
            expect(page.connectMe.value).to.eql(1);

        } finally {
            reduxApp.dispose();
        }
    });

    it("does not connect a component with non-existent id (using named app)", () => {

        const testAppName = 'connect-test-4';

        @component
        class App {
            public comp = new MyComponent();
        }

        @component
        class MyComponent {
            public value = 0;

            public increment() {
                this.value = this.value + 1;
            }
        }

        class Page {
            @connect({ app: testAppName, id: 'my-id' })
            public connectMe: MyComponent;
        }

        // create some view model
        const page = new Page();

        expect(page.connectMe).to.be.undefined;

        // create the app
        const plainApp = new App();

        expect(page.connectMe).to.be.undefined;
        expect(plainApp.comp.value).to.eql(0);

        // elevate the app
        const reduxApp = new ReduxApp(plainApp, { name: testAppName });
        try {

            // assert not connected
            expect(page.connectMe).to.be.undefined;

        } finally {
            reduxApp.dispose();
        }
    });

    it("connects only component with matching id (doesn't connect a component with different id, using named app)", () => {

        const testAppName = 'connect-test-5';
        const compId = 'my-id';
        const otherId = 'not-my-id';

        @component
        class App {
            @withId(compId)
            public comp = new MyComponent();

            @withId(otherId)
            public otherComp = new MyComponent();
        }

        @component
        class MyComponent {
            public value = 0;

            public increment() {
                this.value = this.value + 1;
            }
        }

        class Page {
            @connect({ app: testAppName, id: compId })
            public connectMe: MyComponent;
        }

        // create some view model
        const page = new Page();

        expect(page.connectMe).to.be.undefined;

        // create the app
        const plainApp = new App();

        expect(page.connectMe).to.be.undefined;
        expect(plainApp.comp.value).to.eql(0);

        // elevate the app
        const reduxApp = new ReduxApp(plainApp, { name: testAppName });
        try {

            // assert correct component connected
            expect(page.connectMe).to.equal(reduxApp.root.comp);

            // assert not connected to wrong component
            expect(page.connectMe).to.not.equal(reduxApp.root.otherComp);

            // assert action affects only the right components
            expect(page.connectMe.value).to.eql(0);
            expect(reduxApp.root.comp.value).to.eql(0);
            expect(reduxApp.root.otherComp.value).to.eql(0);

            reduxApp.root.otherComp.increment();
            expect(page.connectMe.value).to.eql(0);
            expect(reduxApp.root.comp.value).to.eql(0);
            expect(reduxApp.root.otherComp.value).to.eql(1);

            reduxApp.root.comp.increment();
            reduxApp.root.comp.increment();
            expect(page.connectMe.value).to.eql(2);
            expect(reduxApp.root.comp.value).to.eql(2);
            expect(reduxApp.root.otherComp.value).to.eql(1);

        } finally {
            reduxApp.dispose();
        }
    });

});