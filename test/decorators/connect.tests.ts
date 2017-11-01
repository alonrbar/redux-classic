import { expect } from 'chai';
import { component, connect, ReduxApp, withId } from 'src';
import { Component } from 'src/components';
import { Connect } from 'src/decorators';

// tslint:disable:no-unused-expression

describe(nameof(connect), () => {

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

        // assert connected
        expect(page.connectMe).to.equal(reduxApp.root.comp);

        // assert existence
        expect(reduxApp.root.comp).to.be.instanceOf(Component);
        expect(reduxApp.root.comp.value).to.eql(0);

        // assert action works
        reduxApp.root.comp.increment();
        expect(page.connectMe.value).to.eql(1);

        reduxApp.dispose();
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

        // assert connected
        expect(page.connectMe).to.equal(reduxApp.root.comp);

        // assert existence
        expect(reduxApp.root.comp).to.be.instanceOf(Component);
        expect(reduxApp.root.comp.value).to.eql(0);

        // assert action works
        reduxApp.root.comp.increment();
        expect(page.connectMe.value).to.eql(1);

        reduxApp.dispose();
    });

    it("creates a connection between two components in the default app", () => {

        @component
        class MyComponent {
            public value = 0;

            public increment() {
                this.value = this.value + 1;
            }
        }

        @component
        class Page1 {
            @connect
            public comp1: MyComponent;
        }

        class Page2 {
            @connect
            public comp2: MyComponent;
        }

        @component
        class App {

            public page1 = new Page1();
            public page2 = new Page2();

            public warehouse = {
                components: {
                    comp: new MyComponent()
                }
            };
        }

        // create the app
        const plainApp = new App();

        expect(plainApp.warehouse.components.comp.value).to.eql(0);
        expect(plainApp.page1.comp1).to.be.undefined;
        expect(plainApp.page2.comp2).to.be.undefined;

        // elevate the app
        const reduxApp = new ReduxApp(plainApp);

        // assert connected
        expect(reduxApp.root.page1.comp1).to.equal(reduxApp.root.warehouse.components.comp);
        expect(reduxApp.root.page1.comp1).to.be.instanceOf(Component);
        expect(reduxApp.root.page1.comp1).to.equal(reduxApp.root.page2.comp2);

        // validate values
        expect(reduxApp.root.page1.comp1.value).to.eql(0);

        // assert action works
        reduxApp.root.page1.comp1.increment();
        expect(reduxApp.root.page1.comp1.value).to.eql(1);
        expect(reduxApp.root.page2.comp2.value).to.eql(1);
        expect(reduxApp.root.warehouse.components.comp.value).to.eql(1);

        reduxApp.dispose();
    });

    it("creates a connection between two components in the same named app", () => {

        const testAppName = 'connect-test-2';

        @component
        class MyComponent {
            public value = 0;

            public increment() {
                this.value = this.value + 1;
            }
        }

        @component
        class Page1 {
            @connect({ app: testAppName })
            public comp1: MyComponent;
        }

        class Page2 {
            @connect({ app: testAppName })
            public comp2: MyComponent;
        }

        @component
        class App {

            public page1 = new Page1();
            public page2 = new Page2();

            public warehouse = {
                components: {
                    comp: new MyComponent()
                }
            };
        }

        // create the app
        const plainApp = new App();

        expect(plainApp.warehouse.components.comp.value).to.eql(0);
        expect(plainApp.page1.comp1).to.be.undefined;
        expect(plainApp.page2.comp2).to.be.undefined;

        // elevate the app
        const reduxApp = new ReduxApp(plainApp, { name: testAppName });

        // assert connected
        expect(reduxApp.root.page1.comp1).to.equal(reduxApp.root.warehouse.components.comp);
        expect(reduxApp.root.page1.comp1).to.be.instanceOf(Component);
        expect(reduxApp.root.page1.comp1).to.equal(reduxApp.root.page2.comp2);

        // validate values
        expect(reduxApp.root.page1.comp1.value).to.eql(0);

        // assert action works
        reduxApp.root.page1.comp1.increment();
        expect(reduxApp.root.page1.comp1.value).to.eql(1);
        expect(reduxApp.root.page2.comp2.value).to.eql(1);
        expect(reduxApp.root.warehouse.components.comp.value).to.eql(1);

        reduxApp.dispose();
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

        // assert connected
        expect(page.connectMe).to.equal(reduxApp.root.comp);

        // assert existence
        expect(reduxApp.root.comp).to.be.instanceOf(Component);
        expect(reduxApp.root.comp.value).to.eql(0);

        // assert action works
        reduxApp.root.comp.increment();
        expect(page.connectMe.value).to.eql(1);

        reduxApp.dispose();
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

        // assert connected
        expect(page.connectMe).to.equal(reduxApp.root.comp);

        // assert existence
        expect(reduxApp.root.comp).to.be.instanceOf(Component);
        expect(reduxApp.root.comp.value).to.eql(0);

        // assert action works
        reduxApp.root.comp.increment();
        expect(page.connectMe.value).to.eql(1);

        reduxApp.dispose();
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

        // assert not connected
        expect(page.connectMe).to.be.undefined;

        reduxApp.dispose();
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

        reduxApp.dispose();
    });

    it("connected components inside an app are not persisted on the store", () => {

        const testAppName = 'connect-test-6';

        @component
        class MyComponent {
            public value = 0;

            public increment() {
                this.value = this.value + 1;
            }
        }

        @component
        class Page1 {
            @connect({ app: testAppName })
            public comp1: MyComponent;
        }

        class Page2 {
            @connect({ app: testAppName })
            public comp2: MyComponent;
        }

        @component
        class App {

            public page1 = new Page1();
            public page2 = new Page2();

            public warehouse = {
                components: {
                    comp: new MyComponent()
                }
            };
        }

        const app = new ReduxApp(new App(), { name: testAppName });

        app.root.page1.comp1.increment();
        app.root.page2.comp2.increment();

        const state = app.store.getState();
        const connectedComponentState = Connect.connectReducer();
        expect(state.warehouse.components.comp).to.not.eql(connectedComponentState);
        expect(state.page1.comp1).to.be.eql(connectedComponentState);
        expect(state.page2.comp2).to.be.eql(connectedComponentState);

        app.dispose();
    });

});