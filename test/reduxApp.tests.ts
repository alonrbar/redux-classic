import { expect } from 'chai';
import { component, ReduxApp } from 'src';
import { Component } from 'src/components';

describe(nameof(ReduxApp), () => {

    describe('constructor', () => {

        it("components nested inside standard objects are constructed", () => {

            @component
            class Root {
                public first = {
                    second: new Level2()
                };
            }

            class Level2 {
                public third = new Level3();
            }

            class Level3 {
                public some = new ThisIsAComponent();
            }

            @component
            class ThisIsAComponent {
                public dispatchMe() {
                    /* noop */
                }
            }

            // create component tree
            const app = new ReduxApp(new Root());

            expect(app.root.first.second.third.some).to.be.an.instanceOf(Component);
        });
    });
});