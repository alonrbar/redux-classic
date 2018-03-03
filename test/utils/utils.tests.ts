import { expect } from 'chai';
import { getAllPropertyDescriptors, getMethods } from 'src/utils';

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

        it("descriptors of derived class overrides descriptor of base class", () => {

            let message = '';

            class Base {
                public foo() {
                    message = 'foo base';
                }
            }

            class Derived extends Base {
                public foo() {
                    message = 'foo derived';
                }
            }

            const obj = new Derived();
            const descriptors = getAllPropertyDescriptors(obj);

            expect(Object.keys(descriptors).length).to.eql(1);
            expect(descriptors).to.haveOwnProperty('foo');

            obj.foo();
            expect(message).to.eql('foo derived');
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
});