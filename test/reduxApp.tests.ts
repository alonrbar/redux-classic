import { expect } from 'chai';
import { action, ReduxClassic, withId } from 'src';
import { Module } from 'src/module';

// tslint:disable:no-unused-expression

describe(nameof(ReduxClassic), () => {

    describe('constructor', () => {

        it("does not throw on null values", () => {

            class Root {
                public value: string = null;
            }

            // create module tree            
            const app = ReduxClassic.create(new Root());
            app.dispose();
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
            const app = ReduxClassic.create(new Root());
            try {

                expect(app.root.first.second.third.some).to.be.an.instanceOf(Module);

            } finally {
                app.dispose();
            }
        });

        it("handles pre-loaded state of nested module", () => {

            class Root {
                public first = {
                    second: new Level2()
                };
            }

            class Level2 {
                public theModule = new ThisIsAModule();
            }

            class ThisIsAModule {

                public value: string = 'before';

                @action
                public changeValue() {
                    this.value = 'after';
                }
            }

            const preLoadedState = {
                first: {
                    second: {
                        theModule: {
                            value: 'I am here!'
                        }
                    }
                }
            };

            // create module tree
            const root = new Root();
            expect(root.first.second.theModule).to.be.an.instanceOf(ThisIsAModule);
            expect(root.first.second.theModule.value).to.eql('before');

            // create the app
            const app = ReduxClassic.create(root, undefined, preLoadedState);
            try {

                expect(app.root.first.second.theModule).to.be.an.instanceOf(Module);
                expect(app.root.first.second.theModule.value).to.eql('I am here!');

                // verify state is updating
                app.root.first.second.theModule.changeValue();
                expect(app.root.first.second.theModule).to.be.an.instanceOf(Module);
                expect(app.root.first.second.theModule.value).to.eql('after');

            } finally {
                app.dispose();
            }
        });

        it("handles pre-loaded state of plain class instances", () => {

            class Root {
                public first = {
                    second: new Level2()
                };
            }

            class Level2 {
                public theModule = new ThisIsAModule();
            }

            class ThisIsAModule {

                public value: string = 'before';

                public changeValue() {
                    this.value = 'after';
                }
            }

            const preLoadedState = {
                first: {
                    second: {
                        theModule: {
                            value: 'I am here!'
                        }
                    }
                }
            };

            // create module tree
            const root = new Root();
            expect(root.first.second.theModule.value).to.eql('before');

            // create the app
            const app = ReduxClassic.create(root, undefined, preLoadedState);
            try {

                expect(app.root.first.second.theModule.value).to.eql('I am here!');

                // verify state is updating
                app.root.first.second.theModule.changeValue();
                expect(app.root.first.second.theModule.value).to.eql('after');

            } finally {
                app.dispose();
            }
        });

        it("arrays of objects from the app creator are stored in the store state", () => {

            class Some {

            }

            class Root {
                public arr: Some[];

                constructor(arr?: Some[]) {
                    this.arr = arr || [];
                }
            }

            const app = ReduxClassic.create(new Root([new Some(), new Some(), new Some()]), undefined);

            try {
                const state = app.store.getState();
                expect(Array.isArray(state.arr)).to.be.true;
            } finally {
                app.dispose();
            }
        });
    });

    describe('updateState', () => {

        describe('updateState option', () => {

            it("module tree is not updated when 'updateState' options is turned off", () => {

                class App {
    
                    public num = 0;
    
                    @action
                    public increment() {
                        this.num = this.num + 1;
                    }
                }
    
                const app = ReduxClassic.create(new App(), { updateState: false });
                try {
    
                    expect(app.root.num).to.eq(0);
    
                    app.root.increment();
    
                    expect(app.root.num).to.eq(0);
    
                } finally {
                    app.dispose();
                }
            });
    
            it("store still updates when 'updateState' options is turned off", () => {
    
                class App {
    
                    public num = 0;
    
                    @action
                    public increment() {
                        this.num = this.num + 1;
                    }
                }
    
                const app = ReduxClassic.create(new App(), { updateState: false });
                try {
    
                    expect(app.store.getState().num).to.eq(0);
    
                    app.root.increment();
    
                    expect(app.store.getState().num).to.eq(1);
    
                } finally {
                    app.dispose();
                }
            });

        });

        describe('properties', () => {

            it('removes module properties that do not exists on the new state', () => {

                // create the module
                class MyModule {
                    public prop1: string = undefined;
                    public prop2: string = undefined;
    
                    @action
                    public setAndRemove() {
                        delete this.prop1;
                        this.prop2 = 'hello';
                    }
                }
                const app = ReduxClassic.create(new MyModule());
                try {
    
                    // test before
                    expect(app.root).to.haveOwnProperty('prop1');
                    expect(app.root).to.haveOwnProperty('prop2');
    
                    // test after
                    app.root.setAndRemove();
                    expect(app.root).to.not.haveOwnProperty('prop1');
                    expect(app.root).to.haveOwnProperty('prop2');
    
                } finally {
                    app.dispose();
                }
            });
    
            it('does not remove module properties that exists on the new state but are undefined', () => {
    
                // create the module
                class MyModule {
                    public prop1: string = undefined;
                    public prop2: string = undefined;
    
                    @action
                    public updateProp2Only() {
                        this.prop2 = 'hello';
                    }
                }
                const app = ReduxClassic.create(new MyModule());
                try {
    
                    // test before
                    expect(app.root).to.haveOwnProperty('prop1');
                    expect(app.root).to.haveOwnProperty('prop2');
    
                    // test after
                    app.root.updateProp2Only();
                    expect(app.root).to.haveOwnProperty('prop1');
                    expect(app.root).to.haveOwnProperty('prop2');
    
                } finally {
                    app.dispose();
                }
            });
    
            it('does not remove module getters', () => {
    
                // create the module
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
                const app = ReduxClassic.create(new MyModule());
                try {
    
                    // test before
                    expect(app.root).to.haveOwnProperty('prop1');
                    expect(app.root).to.haveOwnProperty('prop2');
    
                    // test after
                    app.root.updateProp2Only();
                    expect(app.root).to.haveOwnProperty('prop1');
                    expect(app.root).to.haveOwnProperty('prop2');
    
                } finally {
                    app.dispose();
                }
            });

        });

        describe('actions', () => {
            
            it("actions of a module are invoked only once, even if it appears several time in the tree", () => {

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
    
                let count = 0;
                class IAmModule {
    
                    public value = 0;
    
                    @action
                    public dispatchMe() {
                        count++;
                        this.value = this.value + 1;
                    }
                }
    
                // create module tree
                const app = ReduxClassic.create(new Root());
                try {
    
                    // before dispatching
                    expect(count).to.eql(0);
                    expect(app.root.link.value).to.eql(0);
                    expect(app.root.original.value).to.eql(0);
                    expect(app.root.nested.link.value).to.eql(0);
    
                    // after dispatching
                    app.root.link.dispatchMe();
                    expect(count).to.eql(1, 'count is not 1');
                    expect(app.root.link.value).to.eql(1, 'link.value is not 1');
                    expect(app.root.original.value).to.eql(1, 'original.value is not 1');
                    expect(app.root.nested.link.value).to.eql(1, 'nested.link.value is not 1');
    
                } finally {
                    app.dispose();
                }
            });
    
            it("actions of a module nested inside standard objects can be invoked multiple times", () => {
    
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
    
                class Counter {
                    public value = 0;
    
                    @action
                    public increment() {
                        this.value = this.value + 1;
                    }
                }
    
                // create module tree
                const app = ReduxClassic.create(new Root());
                try {
    
                    expect(app.root.first.second.third.counter.value).to.eql(0);
                    app.root.first.second.third.counter.increment();
                    expect(app.root.first.second.third.counter.value).to.eql(1);
                    app.root.first.second.third.counter.increment();
                    expect(app.root.first.second.third.counter.value).to.eql(2);
                    app.root.first.second.third.counter.increment();
                    expect(app.root.first.second.third.counter.value).to.eql(3);
    
                } finally {
                    app.dispose();
                }
            });

        });

        it("modules nested inside standard objects are synced with the store's state", () => {

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

                public value = 0;

                @action
                public dispatchMe() {
                    this.value = 1;
                }
            }

            // create module tree
            const app = ReduxClassic.create(new Root());
            try {

                // before dispatching
                expect(app.root.first.second.third.some.value).to.eql(0);

                // after dispatching
                app.root.first.second.third.some.dispatchMe();
                expect(app.root.first.second.third.some.value).to.eql(1);

            } finally {
                app.dispose();
            }
        });        

        it("adds, removes and updates objects in an array", () => {

            class App {
                public items: Item[] = [];

                @action
                public push() {
                    this.items = this.items.concat(new Item());
                }

                @action
                public pop() {
                    this.items = this.items.slice(0, this.items.length - 1);
                }

                @action
                public incrementIndex(index: number) {
                    this.items = this.items.map((item, i) => {
                        if (i === index) {
                            const { value, ...otherProps } = item;
                            return {
                                value: value + 1,
                                ...otherProps
                            };
                        } else {
                            return item;
                        }
                    });
                }

                @action
                public updateFirstItem(newValue: number) {
                    const newItem = new Item();
                    newItem.value = newValue;
                    this.items = this.items.map((item, index) => index === 0 ? newItem : item);
                }
            }

            class Item {
                public value = 0;
            }

            const app = ReduxClassic.create(new App());
            try {

                // push

                expect(app.root.items.length).to.eql(0);

                app.root.push();
                app.root.push();
                app.root.push();
                app.root.push();
                app.root.push();

                expect(app.root.items.length).to.eql(5);

                // update

                app.root.incrementIndex(3);
                expect(app.root.items[4].value).to.eql(0);
                expect(app.root.items[3].value).to.eql(1);
                expect(app.root.items[2].value).to.eql(0);

                // pop

                app.root.pop();
                expect(app.root.items.length).to.eql(4);
                expect(app.root.items[3].value).to.eql(1);
                expect(app.root.items[2].value).to.eql(0);

                // update

                expect(app.root.items[0].value).to.eql(0);
                app.root.updateFirstItem(5);
                expect(app.root.items[0].value).to.eql(5);

            } finally {
                app.dispose();
            }
        });
    });

    describe('getModule', () => {

        it("retrieves a module by type", () => {

            class Root {
                public comp = new MyModule();
                public otherComp = new MyOtherModule();
            }

            class MyModule {

                @action
                public myAction() {
                    // noop
                }
            }

            class MyOtherModule {

                @action
                public myAction() {
                    // noop
                }
            }

            const appId = Math.random().toString();
            const app = ReduxClassic.create(new Root(), { name: appId });
            try {

                const comp = ReduxClassic.getModule(MyModule, undefined, appId);
                expect(comp).to.equal(app.root.comp);
                expect(comp).to.not.equal(app.root.otherComp);
            } finally {
                app.dispose();
            }
        });

        it("retrieves a module by type and id", () => {

            class Root {
                @withId('first comp')
                public comp1 = new MyModule();
                @withId('second comp')
                public comp2 = new MyModule();
                public otherComp = new MyOtherModule();
            }

            class MyModule {

                @action
                public myAction() {
                    // noop
                }
            }

            class MyOtherModule {

                @action
                public myAction() {
                    // noop
                }
            }

            const appId = Math.random().toString();
            const app = ReduxClassic.create(new Root(), { name: appId });
            try {

                const comp = ReduxClassic.getModule(MyModule, 'second comp', appId);
                expect(comp).to.equal(app.root.comp2);
                expect(comp).to.not.equal(app.root.comp1);
                expect(comp).to.not.equal(app.root.otherComp);
            } finally {
                app.dispose();
            }
        });
    });
});