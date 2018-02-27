import { expect } from 'chai';
import { action } from 'src';
import { getCreatorMethods } from 'src/info';

describe('creator methods', () => {
    describe(nameof(getCreatorMethods), () => {

        it("returns own methods of a component", () => {

            class MyComponent {
                
                @action
                public foo() {
                    // noop
                }

                @action
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

            class BaseComponent {
                @action
                public bar() {
                    // noop
                }
            }

            class DerivedComponent extends BaseComponent {
                @action
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

            class BaseComponent {
                @action
                public bar() {
                    // noop
                }
            }

            class DerivedComponent extends BaseComponent {
                @action
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

            class BaseNonComponent {
                public bar() {
                    // noop
                }
            }

            class DerivedComponent extends BaseNonComponent {
                @action
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