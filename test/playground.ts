import { expect } from 'chai';
import { component, isInstanceOf } from 'src';
import { Component } from 'src/components';
import { FakeStore } from './testTypes';

// tslint:disable:no-unused-expression

describe("playground", () => {
    it("it is a place to run wild", () => {

        @component
        class MyComponent {
            public value = 'hi';
        }

        const myComponent = Component.create(new FakeStore(), new MyComponent());

        debugger;
        expect(isInstanceOf(myComponent, MyComponent)).to.be.true;
    });
});