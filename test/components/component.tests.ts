import { expect } from 'chai';
import { component, ReduxApp } from 'src';
import { Component } from 'src/components/component';
import { FakeStore } from '../testTypes';

// tslint:disable:no-unused-expression

describe(nameof(Component), () => {

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
            const store = new FakeStore();
            const root: any = new Component(store, new Root());

            expect(root.first.second.third.some).to.be.an.instanceOf(Component);
        });

        it("components nested inside standard objects are connected to store's dispatch function", () => {

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

            // fake store
            var isConnected = false;
            const store = new FakeStore();
            (store.dispatch as any) = () => { isConnected = true; };

            // create component tree
            const root: any = new Component(store, new Root());

            // before dispatching
            expect(isConnected).to.be.false;

            // after dispatching
            root.first.second.third.some.dispatchMe();
            expect(isConnected).to.be.true;
        });

        it("standard object nested inside components are not connected to store's dispatch function", () => {

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
                public some = new ThisIsNotAComponent();
            }

            class ThisIsNotAComponent {
                public dispatchMe() {
                    /* noop */
                }
            }

            // fake store
            var isConnected = false;
            const store = new FakeStore();
            (store.dispatch as any) = () => { isConnected = true; };

            // create component tree
            const root: any = new Component(store, new Root(), null, [], new Set());

            // assert
            root.first.second.third.some.dispatchMe();
            expect(isConnected).to.be.false;
        });

        it("components nested inside standard objects are connected to store's state", () => {

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

        it("handles null values", () => {

            @component
            class Root {
                public value: string = null;
            }

            // create component tree
            new ReduxApp(new Root());
        });
    });

    describe('updateState', () => {

        it('removes component properties that do not exists on the new state', () => {

            // configure the fake store
            var store = new FakeStore();

            var notifyStateChanged: () => void;
            (store.subscribe as any) = (listener?: () => void) => {
                notifyStateChanged = listener;
            };

            store.getState = () => ({
                prop2: 'hello'
            });

            // create the component
            @component
            class MyComponent {
                public prop1: string = undefined;
                public prop2: string = undefined;
            }
            const comp = new Component(store, new MyComponent());

            // test before
            expect(comp).to.haveOwnProperty('prop1');
            expect(comp).to.haveOwnProperty('prop2');

            // test after
            notifyStateChanged();
            expect(comp).to.not.haveOwnProperty('prop1');
            expect(comp).to.haveOwnProperty('prop2');
        });

        it('does not remove component properties that exists on the new state but are undefined', () => {

            // configure the fake store
            var store = new FakeStore();

            var notifyStateChanged: () => void;
            (store.subscribe as any) = (listener?: () => void) => {
                notifyStateChanged = listener;
            };

            store.getState = () => ({
                prop: undefined
            });

            // create the component
            @component
            class MyComponent {
                public prop: string = undefined;
            }
            const comp = new Component(store, new MyComponent());

            // test before
            expect(comp).to.haveOwnProperty('prop');

            // test after
            notifyStateChanged();
            expect(comp).to.haveOwnProperty('prop');
        });

    });
});