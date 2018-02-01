import { expect } from 'chai';
import { component, ReduxApp, connect } from 'src';
import { Connect } from 'src/decorators';

// tslint:disable:no-unused-expression

describe('playground', () => {

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
            public linkToSource1: MyComponent;
        }

        class Page2 {
            @connect({ app: testAppName })
            public linkToSource2: MyComponent;
        }

        @component
        class App {

            public page1 = new Page1();
            public page2 = new Page2();

            public warehouse = {
                components: {
                    source: new MyComponent()
                }
            };
        }

        const app = new ReduxApp(new App(), { name: testAppName });
        try {

            app.root.page1.linkToSource1.increment();
            app.root.page2.linkToSource2.increment();

            expect(app.store.getState().warehouse.components.source.toString()).to.not.contain(Connect.placeholderPrefix, 'source replaced');
            expect(app.store.getState().page1.linkToSource1.toString().startsWith(Connect.placeholderPrefix)).to.be.true;
            expect(app.store.getState().page2.linkToSource2.toString().startsWith(Connect.placeholderPrefix)).to.be.true;

        } finally {
            app.dispose();
        }
    });
});