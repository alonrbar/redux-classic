import { expect } from 'chai';
import { component, isInstanceOf } from 'src';
import { Component } from 'src/components';
import { FakeStore } from '../testTypes';

// tslint:disable:no-unused-expression

describe('component utils', () => {
    describe(nameof(isInstanceOf), () => {

        it("returns true on an instance of a simple class", () => {

            @component
            class MyComponent {
                public value = 'hi';
            }

            const myComponent = new MyComponent();

            expect(isInstanceOf(myComponent, MyComponent)).to.be.true;
        });

        it("returns true on a component", () => {

            @component
            class MyComponent {
                public value = 'hi';
            }

            const myComponent = Component.create(new FakeStore(), new MyComponent());

            expect(isInstanceOf(myComponent, MyComponent)).to.be.true;
        });

        it("returns false on an instance of a simple class", () => {

            @component
            class MyComponent {
                public value = 'hi';
            }

            @component
            class OtherComponent {
                public value = 'hi';
            }

            const myComponent = new MyComponent();

            expect(isInstanceOf(myComponent, OtherComponent)).to.be.false;
        });

        it("returns false on a component", () => {

            @component
            class MyComponent {
                public value = 'hi';
            }

            @component
            class OtherComponent {
                public value = 'hi';
            }

            const myComponent = Component.create(new FakeStore(), new MyComponent());
            Component.create(new FakeStore(), new OtherComponent());

            expect(isInstanceOf(myComponent, OtherComponent)).to.be.false;
        });
    });
});