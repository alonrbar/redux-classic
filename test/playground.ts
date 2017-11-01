import { expect } from 'chai';
import { component, ReduxApp, connect } from 'src';
import { Connect } from 'src/decorators';
import { Component } from '../src/components/component';

// tslint:disable:no-unused-expression

describe("playground", () => {
    it("it is a place to run wild", () => {

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

        debugger;

        const plainApp = new App();
        const reduxApp = new ReduxApp(plainApp);

        reduxApp.root.page1.comp1.increment();
        reduxApp.root.page2.comp2.increment();

        const state = reduxApp.store.getState();
        const connectedComponentState = Connect.connectReducer();

        expect(reduxApp.root.page1.comp1).to.be.instanceOf(Component);

        expect(state.warehouse.components.comp).to.not.eql(connectedComponentState);
        expect(state.page1.comp1).to.be.eql(connectedComponentState);
        expect(state.page2.comp2).to.be.eql(connectedComponentState);

        reduxApp.dispose();
    });
});