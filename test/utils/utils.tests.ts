import { expect } from 'chai';
import { getParentType, getType } from 'src/utils';

describe('utils', () => {

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
});