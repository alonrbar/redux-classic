import { expect } from 'chai';
import { connect, component, ReduxApp } from 'src';
import { Component } from 'src/components';
import { withId } from '../../src/decorators/withId';

// tslint:disable:no-unused-expression

describe(nameof(connect), () => {

    it("creates a connection between a component inside an app and a component outside of it", () => {

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

        expect(plainApp.comp.value).to.eql(0);
        expect(page.connectMe).to.be.undefined;

        // elevate the app
        const reduxApp = new ReduxApp(plainApp, { name: testAppName });

        // assert connected
        expect(page.connectMe).to.equal(reduxApp.root.comp);

        // assert existence
        expect(reduxApp.root.comp).to.be.instanceOf(Component);
        expect(reduxApp.root.comp.value).to.eql(0);

        // assert actions still works
        reduxApp.root.comp.increment();
        expect(page.connectMe.value).to.eql(1);
    });

    it("creates a connection between two components in the same app", () => {

        const testAppName = 'connect-test-2';
        // const compId = 'comp-id';        

        @component
        class MyComponent {
            public value = 0;

            public increment() {
                this.value = this.value + 1;
            }
        }

        class Page {
            public comp = new MyComponent();
        }

        @component
        class Zapp {
            
            @connect({ app: testAppName })
            public comp: MyComponent;

            public page1 = new Page();
            public page2 = new Page();
        }                        

        // create the app
        const plainApp = new Zapp();

        expect(plainApp.comp.value).to.eql(0);

        // elevate the app
        const reduxApp = new ReduxApp(plainApp, { name: testAppName });

        // the assert
        expect(reduxApp.root.page1.comp).to.equal(reduxApp.root.page2.comp);

        // more assertions
        expect(reduxApp.root.comp).to.be.instanceOf(Component, 'component of elevated app not found');
        expect(reduxApp.root.comp.value).to.eql(0);

        reduxApp.root.comp.increment();
        expect(reduxApp.root.comp.value).to.eql(1);
    });

    it("creates a connection between a component inside an app and a component outside of it - with id", () => {

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

        expect(plainApp.comp.value).to.eql(0);
        expect(page.connectMe).to.be.undefined;

        // elevate the app
        const reduxApp = new ReduxApp(plainApp, { name: testAppName });

        // assert connected
        expect(page.connectMe).to.equal(reduxApp.root.comp);

        // assert existence
        expect(reduxApp.root.comp).to.be.instanceOf(Component);
        expect(reduxApp.root.comp.value).to.eql(0);

        // assert actions still works
        reduxApp.root.comp.increment();
        expect(page.connectMe.value).to.eql(1);
    });

    it("does not connect a component with non-existent id", () => {

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

        expect(plainApp.comp.value).to.eql(0);
        expect(page.connectMe).to.be.undefined;

        // elevate the app
        new ReduxApp(plainApp, { name: testAppName });

        expect(page.connectMe).to.be.undefined;
    });

});