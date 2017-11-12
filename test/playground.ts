import { component } from 'src';
import { expect } from 'chai';
import { getComponentMethods } from 'src/components';

describe('playground', () => {
    it("does not return methods of non-component base class", () => {

        @component
        class BaseComponent {
            public bar() {
                // noop
            }
        }

        class IntermediateClass extends BaseComponent {
            public goo() {
                // noop
            }
        }

        @component
        class DerivedComponent extends IntermediateClass {
            public foo() {
                // noop
            }
        }

        const myComponent = new DerivedComponent();

        debugger;
        const methods = getComponentMethods(myComponent);

        expect(methods).to.haveOwnProperty('foo');
        expect(methods).to.haveOwnProperty('bar');
        expect(methods).to.not.haveOwnProperty('goo');
    });
});