import { expect } from 'chai';
import { action } from 'src';
import { ModuleInfo } from 'src/info';
import { Module } from 'src/module';
import { FakeStore } from '../testTypes';

// tslint:disable:no-unused-expression

describe(nameof(Module), () => {

    describe('create', () => {

        it("does not throw on null values", () => {

            class Root {
                public value: string = null;
            }

            const store = new FakeStore();
            Module.create(store, new Root());
        });

        it("modules nested inside standard objects are constructed", () => {

            class Root {
                public first = {
                    second: new Level2()
                };
            }

            class Level2 {
                public third = new Level3();
            }

            class Level3 {
                public some = new ThisIsAModule();
            }

            class ThisIsAModule {

                @action
                public dispatchMe() {
                    /* noop */
                }
            }

            // create module tree
            const store = new FakeStore();
            const root: any = Module.create(store, new Root());

            expect(root).to.be.an.instanceOf(Module); // root is always a module
            expect(root.first).to.not.be.an.instanceOf(Module);
            expect(root.first.second).to.not.be.an.instanceOf(Module);
            expect(root.first.second.third).to.not.be.an.instanceOf(Module);
            expect(root.first.second.third.some).to.be.an.instanceOf(Module);
        });

        it("multiple modules created from the same creator instance are pointing to the same module instance", () => {

            class Root {
                public link: IAmModule;
                public original = new IAmModule();
                public nested: NestedModule;

                constructor() {
                    this.link = this.original;
                    this.nested = new NestedModule(this.link);
                }
            }

            class NestedModule {
                constructor(public readonly link: IAmModule) {
                }
            }

            class IAmModule {

                @action
                public dispatchMe() {
                    // noop
                }
            }

            // create module tree
            const store = new FakeStore();
            const root: any = Module.create(store, new Root());

            expect(root.link).to.equal(root.original);
            expect(root.original).to.equal(root.nested.link);
        });

        it("circular references does not result in an endless loop", () => {

            class Root {

                public originalComp = new CanBeCircularModule();
                public circularComp: CircularModuleHolder;

                public originalObj = new CanBeCircularObject();
                public circularObj: CircularObjectHolder;

                constructor() {
                    this.circularComp = new CircularModuleHolder(this.originalComp);
                    this.circularObj = new CircularObjectHolder(this.originalObj);
                }
            }

            class CircularModuleHolder {
                constructor(public readonly original: CanBeCircularModule) {
                    original.circle = this;
                }
            }

            class CanBeCircularModule {

                public circle: CircularModuleHolder;

                @action
                public dispatchMe() {
                    // noop
                }
            }

            class CircularObjectHolder {
                constructor(public readonly original: CanBeCircularObject) {
                    original.circle = this;
                }
            }

            class CanBeCircularObject {
                public circle: CircularObjectHolder;
            }

            // create module tree
            const store = new FakeStore();
            const root: Root = (Module.create(store, new Root()) as any);

            expect(root.circularComp.original).to.equal(root.originalComp, 'different modules');
            expect(root.circularObj.original).to.equal(root.originalObj, 'different objects');
        });

        it("modules nested inside standard objects are connected to store's dispatch function", () => {

            class Root {
                public first = {
                    second: new Level2()
                };
            }

            class Level2 {
                public third = new Level3();
            }

            class Level3 {
                public some = new ThisIsAModule();
            }

            class ThisIsAModule {

                @action
                public dispatchMe() {
                    /* noop */
                }
            }

            // fake store
            var isConnected = false;
            const store = new FakeStore();
            (store.dispatch as any) = () => { isConnected = true; };

            // create module tree
            const root: any = Module.create(store, new Root());

            // before dispatching
            expect(isConnected).to.be.false;

            // after dispatching
            root.first.second.third.some.dispatchMe();
            expect(isConnected).to.be.true;
        });

        it("standard object nested inside modules are not connected to store's dispatch function", () => {

            class Root {
                public first = {
                    second: new Level2()
                };
            }

            class Level2 {
                public third = new Level3();
            }

            class Level3 {
                public some = new ThisIsNotAModule();
            }

            class ThisIsNotAModule {

                public dispatchMe() {
                    /* noop */
                }
            }

            // fake store
            var isConnected = false;
            const store = new FakeStore();
            (store.dispatch as any) = () => { isConnected = true; };

            // create module tree
            const root: any = Module.create(store, new Root());

            // assert
            root.first.second.third.some.dispatchMe();
            expect(isConnected).to.be.false;
        });

        it("two different module classes with the same method name has separate methods", () => {

            class Root {
                public first = new First();
                public second = new Second();
            }

            class First {

                @action
                public foo() {
                    return 'First foo';
                }
            }

            class Second {

                @action
                public foo() {
                    return 'Second foo';
                }
            }

            var root: Root = Module.create(new FakeStore(), new Root()) as any;

            expect(root.first.foo.toString).to.not.equal(root.second.foo);
        });

        it("two module instances of the same class has the same methods", () => {

            class TheModule {

                @action
                public foo() {
                    return 5;
                }
            }

            var comp1: TheModule = Module.create(new FakeStore(), new TheModule()) as any;
            var comp2: TheModule = Module.create(new FakeStore(), new TheModule()) as any;

            expect(comp1.foo).to.equal(comp2.foo);
        });

        it("derived module dispatches parent actions with derived namespace", () => {

            class Base {

                @action
                public bar() {
                    // noop
                }
            }

            class Derived extends Base {

                @action
                public foo() {
                    // noop
                }
            }

            // fake store
            const store = new FakeStore();
            var dispatchedAction: any;
            (store.dispatch as any) = (actionObject: any) => { dispatchedAction = actionObject; };

            // create module tree
            const comp: any = Module.create(store, new Derived());

            // has methods
            expect(comp).to.have.property('foo');
            expect(comp).to.have.property('bar');

            // dispatch
            comp.foo();
            expect(dispatchedAction).to.not.be.undefined;
            expect(dispatchedAction.type).be.a('string');
            expect(dispatchedAction.type.toLowerCase()).to.include(nameof(Derived).toLowerCase());
        });

        it('module getters are preserved', () => {

            class MyModule {

                public get prop1(): string {
                    return 'hi';
                }
                public prop2: string = undefined;

                @action
                public updateProp2Only() {
                    this.prop2 = 'hello';
                }
            }

            const store = new FakeStore();
            const comp = Module.create(store, new MyModule());

            expect(comp).to.haveOwnProperty('prop1');
            expect(comp).to.haveOwnProperty('prop2');
        });
    });

    describe('reducer', () => {

        it("throws when invoking an action from within another action", () => {

            class Person {

                public name: string;

                @action
                public changeName(name: string) {
                    this.name = name;
                }

                @action
                public shouldThrow() {
                    this.changeName('something');
                }
            }

            const store = new FakeStore();
            const comp = Module.create(store, new Person());
            const info = ModuleInfo.getInfo(comp);
            const reducer = info.reducerCreator(() => { /* noop */ });

            expect(() => reducer({}, { type: 'Person.shouldThrow' })).to.throw(Error);
        });

        it("does not throw when invoking regular methods from within actions", () => {

            class Person {
                public name: string;

                @action
                public changeName(name: string) {
                    this.name = this.toUpperCase(name);
                }

                public toUpperCase(str: string) {
                    return str.toUpperCase();
                }
            }

            const store = new FakeStore();
            const comp = Module.create(store, new Person());
            const info = ModuleInfo.getInfo(comp);
            const reducer = info.reducerCreator(() => { /* noop */ });

            var newState = reducer({}, { type: 'Person.changeName', payload: ['alon'] }) as any;

            expect(newState.name).to.eql('ALON');
        });
    });
});