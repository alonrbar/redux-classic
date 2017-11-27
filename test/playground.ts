import { expect } from 'chai';
import { component, ReduxApp } from 'src';
import { Component } from 'src/components';

describe('playground', () => {
    it("a place to run wild", () => {

        @component
        class Root {
            public first = {
                second: new Level2()
            };
        }

        class Level2 {
            public theComponent = new ThisIsAComponent();
        }

        @component
        class ThisIsAComponent {

            public value: string = 'before';

            public changeValue() {
                this.value = 'after';
            }
        }

        const preLoadedState = {
            first: {
                second: {
                    theComponent: {
                        value: 'I am here!'
                    }
                }
            }
        };

        // create component tree
        const root = new Root();
        expect(root.first.second.theComponent).to.be.an.instanceOf(ThisIsAComponent);
        expect(root.first.second.theComponent.value).to.eql('before');

        // create the app
        const app = new ReduxApp(root, undefined, preLoadedState);
        expect(app.root.first.second.theComponent).to.be.an.instanceOf(Component);
        expect(app.root.first.second.theComponent.value).to.eql('I am here!');
    });
});