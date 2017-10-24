import { expect } from 'chai';
import { component } from 'src';
import { Component } from 'src/components';
import { FakeStore } from './testTypes';

describe("playground", () => {
    it("it is a place to run wild", () => {

        debugger;

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
});