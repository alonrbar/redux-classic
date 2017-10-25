import { expect } from 'chai';
import { component, ReduxApp } from 'src';
import { Component } from 'src/components';

// tslint:disable:no-unused-expression

describe(nameof(ReduxApp), () => {

    describe('constructor', () => {

        it("does not throw on null values", () => {

            @component
            class Root {
                public value: string = null;
            }

            // create component tree            
            new ReduxApp(new Root());
        });

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

    describe('updateState', () => {

        it("component tree is not updated when 'updateState' options is turned off", () => {
            @component
            class App {
                public num = 0;
                public increment() {
                    this.num = this.num + 1;
                }
            }

            const app = new ReduxApp(new App(), { updateState: false });

            expect(app.root.num).to.eq(0);

            app.root.increment();

            expect(app.root.num).to.eq(0);
        });

        it('removes component properties that do not exists on the new state', () => {

            // create the component
            @component
            class MyComponent {
                public prop1: string = undefined;
                public prop2: string = undefined;

                public setAndRemove() {
                    delete this.prop1;
                    this.prop2 = 'hello';
                }
            }
            const app = new ReduxApp(new MyComponent());

            // test before
            expect(app.root).to.haveOwnProperty('prop1');
            expect(app.root).to.haveOwnProperty('prop2');

            // test after
            app.root.setAndRemove();
            expect(app.root).to.not.haveOwnProperty('prop1');
            expect(app.root).to.haveOwnProperty('prop2');
        });

        it('does not remove component properties that exists on the new state but are undefined', () => {

            // create the component
            @component
            class MyComponent {
                public prop1: string = undefined;
                public prop2: string = undefined;

                public updateProp2Only() {
                    this.prop2 = 'hello';
                }
            }
            const app = new ReduxApp(new MyComponent());

            // test before
            expect(app.root).to.haveOwnProperty('prop1');
            expect(app.root).to.haveOwnProperty('prop2');

            // test after
            app.root.updateProp2Only();
            expect(app.root).to.haveOwnProperty('prop1');
            expect(app.root).to.haveOwnProperty('prop2');
        });

        it("components nested inside standard objects are synced with the store's state", () => {

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

                public value = 0;

                public dispatchMe() {
                    this.value = 1;
                }
            }

            // create component tree
            const app = new ReduxApp(new Root());

            // before dispatching
            expect(app.root.first.second.third.some.value).to.eql(0);

            // after dispatching
            app.root.first.second.third.some.dispatchMe();
            expect(app.root.first.second.third.some.value).to.eql(1);
        });

        it("methods of components nested inside standard objects can be invoked multiple times", () => {

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
                public counter = new Counter();
            }

            @component
            class Counter {
                public value = 0;
                public increment() {
                    this.value = this.value + 1;
                }
            }

            // create component tree
            const app = new ReduxApp(new Root());

            expect(app.root.first.second.third.counter.value).to.eql(0);
            app.root.first.second.third.counter.increment();
            expect(app.root.first.second.third.counter.value).to.eql(1);
            app.root.first.second.third.counter.increment();
            expect(app.root.first.second.third.counter.value).to.eql(2);
            app.root.first.second.third.counter.increment();
            expect(app.root.first.second.third.counter.value).to.eql(3);
        });

    });
});