import { expect } from 'chai';
import { component, noDispatch } from 'src';
import { Component } from 'src/components';
import { ComponentInfo } from 'src/info';
import { FakeStore } from '../testTypes';

// tslint:disable:no-unused-expression

describe(nameof(Component), () => {

    describe('constructor', () => {

        it("does not throw on null values", () => {

            @component
            class Root {
                public value: string = null;
            }

            const store = new FakeStore();
            Component.create(store, new Root());
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
            const store = new FakeStore();
            const root: any = Component.create(store, new Root());

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
            const root: any = Component.create(store, new Root());

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
            const root: any = Component.create(store, new Root());

            // assert
            root.first.second.third.some.dispatchMe();
            expect(isConnected).to.be.false;
        });

        it("two different component classes with the same method name has separate methods", () => {

            @component
            class Root {
                public first = new First();
                public second = new Second();
            }

            @component
            class First {
                public foo() {
                    return 'First foo';
                }
            }

            @component
            class Second {
                public foo() {
                    return 'Second foo';
                }
            }

            var root: Root = Component.create(new FakeStore(), new Root()) as any;

            expect(root.first.foo.toString).to.not.equal(root.second.foo);
        });

        it("two component instances of the same class has the same methods", () => {

            @component
            class TheComponent {
                public foo() {
                    return 5;
                }
            }

            var comp1: TheComponent = Component.create(new FakeStore(), new TheComponent()) as any;
            var comp2: TheComponent = Component.create(new FakeStore(), new TheComponent()) as any;

            expect(comp1.foo).to.equal(comp2.foo);
        });

        it("derived component dispatches parent actions with derived namespace", () => {

            @component
            class Base {
                public bar() {
                    // noop
                }
            }

            @component
            class Derived extends Base {
                public foo() {
                    // noop
                }
            }

            // fake store
            const store = new FakeStore();
            var dispatchedAction: any;
            (store.dispatch as any) = (action: any) => { dispatchedAction = action; };

            // create component tree
            const comp: any = Component.create(store, new Derived());

            // has methods
            expect(comp).to.have.property('foo');
            expect(comp).to.have.property('bar');

            // dispatch
            comp.foo();
            expect(dispatchedAction).to.not.be.undefined;
            expect(dispatchedAction.type).be.a('string');
            expect(dispatchedAction.type.toLowerCase()).to.include(nameof(Derived).toLowerCase());
        });
    });

    describe('reducer', () => {

        it("throws when invoking an action from within another action", () => {

            @component
            class Person {

                public name: string;

                public changeName(name: string) {
                    this.name = name;
                }

                public shouldThrow() {
                    this.changeName('something');
                }
            }

            const store = new FakeStore();
            const comp = Component.create(store, new Person());
            const info = ComponentInfo.getInfo(comp);
            const reducer = info.reducer;

            expect(() => reducer({}, { type: 'PERSON.SHOULD_THROW' })).to.throw;
        });

        it("throws when invoking an action from within another action (implicit call)", () => {

            @component
            class Person {

                public name: string;

                public changeName(name: string) {
                    this.name = name;
                }

                public shouldThrow() {
                    this.changeName('something');
                }
            }

            const store = new FakeStore();
            const comp = Component.create(store, new Person()) as Person;

            expect(() => comp.changeName('alon')).to.throw;
        });

        it("does not throw when invoking noDispatch methods from within actions", () => {

            @component
            class Person {
                public name: string;

                public changeName(name: string) {
                    this.name = this.toUpperCase(name);
                }

                @noDispatch
                public toUpperCase(str: string) {
                    return str.toUpperCase();
                }
            }

            const store = new FakeStore();
            const comp = Component.create(store, new Person());
            const info = ComponentInfo.getInfo(comp);
            const reducer = info.reducer;

            var newState = reducer({}, { type: 'PERSON.CHANGE_NAME', payload: ['alon'] });

            expect(newState.name).to.eql('ALON');
        });

        it("does not throw when invoking noDispatch methods from within actions (implicit call)", () => {

            @component
            class Person {
                public name: string;

                public changeName(name: string) {
                    this.name = this.toUpperCase(name);
                }

                @noDispatch
                public toUpperCase(str: string) {
                    return str.toUpperCase();
                }
            }

            const store = new FakeStore();
            const comp = Component.create(store, new Person()) as Person;

            comp.changeName('alon');
        });
    });
});