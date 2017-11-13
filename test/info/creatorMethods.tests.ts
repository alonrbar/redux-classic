import { expect } from 'chai';
import { component } from 'src';
import { getCreatorMethods } from 'src/info';

describe('component methods', () => {
    describe(nameof(getCreatorMethods), () => {

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
            const methods = getCreatorMethods(myComponent);

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
            const methods = getCreatorMethods(myComponent);

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
            const methods = getCreatorMethods(myComponent, false);

            expect(methods).to.haveOwnProperty('foo');
            expect(methods).to.not.haveOwnProperty('bar');
        });

        it("does not return methods of non-component base class, even if 'inheritance' is set to true", () => {

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
            const methods = getCreatorMethods(myComponent, true);

            expect(methods).to.haveOwnProperty('foo');
            expect(methods).to.not.haveOwnProperty('bar');
        });
    });
});