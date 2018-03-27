import { expect } from 'chai';
import { action, isInstanceOf } from 'src';
import { Module } from 'src/module';
import { FakeStore } from '../testTypes';

// tslint:disable:no-unused-expression

describe('component utils', () => {
    describe(nameof(isInstanceOf), () => {

        it("returns true on an instance of a simple class", () => {

            class MyModule {
                public value = 'hi';
            }

            const myModule = new MyModule();

            expect(isInstanceOf(myModule, MyModule)).to.be.true;
        });

        it("returns true on a component", () => {

            class MyModule {
                
                public value = 'hi';

                @action
                public myAction() {
                    // noop
                }
            }

            const myModule = Module.create(new FakeStore(), new MyModule());

            expect(isInstanceOf(myModule, MyModule)).to.be.true;
        });

        it("returns false on an instance of a simple class", () => {

            class MyModule {
                public value = 'hi';
            }

            class OtherModule {
                public value = 'hi';
            }

            const myModule = new MyModule();

            expect(isInstanceOf(myModule, OtherModule)).to.be.false;
        });

        it("returns false on a component", () => {

            class MyModule {
                
                public value = 'hi';

                @action
                public myAction() {
                    // noop
                }
            }

            class OtherModule {
                
                public value = 'hi';

                @action
                public myAction() {
                    // noop
                }
            }

            const myModule = Module.create(new FakeStore(), new MyModule());
            Module.create(new FakeStore(), new OtherModule());

            expect(isInstanceOf(myModule, OtherModule)).to.be.false;
        });
    });
});