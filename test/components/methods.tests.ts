import { expect } from 'chai';
import { component } from 'src';
import { getComponentMethods } from 'src/components';

describe('component methods', () => {
    describe(nameof(getComponentMethods), () => {

        it("returns own methods of a component", () => {

            @component
            class MyComponent {
                public foo() {
                    // noop
                }

                public bar() {
                    // noop
                }
            }

            const myComponent = new MyComponent();
            const methods = getComponentMethods(myComponent);

            expect(methods).to.haveOwnProperty('foo');
            expect(methods).to.haveOwnProperty('bar');
        });

        it("returns own and inherited methods of a component", () => {

            @component
            class BaseComponent {
                public bar() {
                    // noop
                }
            }

            @component
            class DerivedComponent extends BaseComponent {
                public foo() {
                    // noop
                }
            }

            const myComponent = new DerivedComponent();
            const methods = getComponentMethods(myComponent);

            expect(methods).to.haveOwnProperty('foo');
            expect(methods).to.haveOwnProperty('bar');
        });

        it("returns own and inherited methods of a component, with an intermediate regular class", () => {

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
            const methods = getComponentMethods(myComponent);

            expect(methods).to.haveOwnProperty('foo');
            expect(methods).to.haveOwnProperty('bar');
        });

        it("does not return inherited methods of a component when 'inheritance' is set to false", () => {

            @component
            class BaseComponent {
                public bar() {
                    // noop
                }
            }

            @component
            class DerivedComponent extends BaseComponent {
                public foo() {
                    // noop
                }
            }

            const myComponent = new DerivedComponent();
            const methods = getComponentMethods(myComponent, false);

            expect(methods).to.haveOwnProperty('foo');
            expect(methods).to.not.haveOwnProperty('bar');
        });

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
            const methods = getComponentMethods(myComponent);

            expect(methods).to.haveOwnProperty('foo');
            expect(methods).to.haveOwnProperty('bar');
            expect(methods).to.not.haveOwnProperty('goo');
        });
    });
});