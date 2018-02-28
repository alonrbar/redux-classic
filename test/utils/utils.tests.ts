import { expect } from 'chai';
import { getAllPropertyDescriptors, getMethods, getParentType, getType } from 'src/utils';

describe('utils', () => {

    describe(nameof(getAllPropertyDescriptors), () => {

        it("returns all property descriptors of an object", () => {

            class MyClass {

                public prop = '';

                public foo() {
                    // noop
                }

                public bar() {
                    // noop
                }
            }

            const obj = new MyClass();
            const descriptors = getAllPropertyDescriptors(obj);

            expect(Object.keys(descriptors).length).to.eql(3);

            expect(descriptors).to.haveOwnProperty('prop');
            expect(descriptors).to.haveOwnProperty('foo');
            expect(descriptors).to.haveOwnProperty('bar');
        });

    });

    describe(nameof(getMethods), () => {

        it("returns the methods of an object", () => {

            class MyClass {
                public foo() {
                    // noop
                }

                public bar() {
                    // noop
                }
            }

            const obj = new MyClass();
            const methods = getMethods(obj);

            expect(Object.keys(methods).length).to.eql(2);

            expect(methods).to.haveOwnProperty('foo');
            expect(methods).to.haveOwnProperty('bar');
        });

        it("returns the methods of a constructor function", () => {

            class MyClass {
                public foo() {
                    // noop
                }

                public bar() {
                    // noop
                }
            }

            const methods = getMethods(MyClass);

            expect(Object.keys(methods).length).to.eql(2);

            expect(methods).to.haveOwnProperty('foo');
            expect(methods).to.haveOwnProperty('bar');
        });

    });

    describe(nameof(getParentType), () => {

        it("returns the parent type of an object", () => {

            class MyClass {
            }

            const obj = new MyClass();
            const parentType = getParentType(obj);

            expect(parentType).to.equal(Object);
        });

        it("returns the parent type of an object of derived type", () => {

            class Base {
            }

            class Derived extends Base {
            }

            const obj = new Derived();
            const parentType = getParentType(obj);

            expect(parentType).to.equal(Base);
        });

        it("returns the parent type of a class of derived type", () => {

            class Base {
            }

            class Derived extends Base {
            }

            const parentType = getParentType(Derived);

            expect(parentType).to.equal(Base);
        });

        it("returns the parent type of an object of deeply derived type", () => {

            class Base {
            }

            class Derived extends Base {
            }

            class DeDerived extends Derived {
            }

            // parent type
            const obj = new DeDerived();
            const parentType = getParentType(obj);
            expect(parentType).to.equal(Derived);

            // grand parent type
            const grandParentType = getParentType(parentType);
            expect(grandParentType).to.equal(Base);
        });

    });

    describe(nameof(getType), () => {

        it("returns the type of an object", () => {

            class MyClass {
            }

            const obj = new MyClass();
            const type = getType(obj);

            expect(type).to.equal(MyClass);
        });

        it("returns the type of an object of derived type", () => {

            class Base {
            }

            class Derived extends Base {
            }

            const obj = new Derived();
            const type = getType(obj);

            expect(type).to.equal(Derived);
        });

    });
});