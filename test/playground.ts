import { expect } from 'chai';
import { component, ReduxApp, connect } from 'src';
import { Component } from 'src/components';

// tslint:disable:no-unused-expression

describe("playground", () => {
    it("it is a place to run wild", () => {

        const testAppName = 'connect-test-2';

        @component
        class MyComponent {
            public value = 0;

            public increment() {
                this.value = this.value + 1;
            }
        }

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
        // expect(plainApp.page1.comp1).to.be.undefined;
        // expect(plainApp.page2.comp2).to.be.undefined;

        // elevate the app
        const reduxApp = new ReduxApp(plainApp, { name: testAppName });

        debugger;

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
});