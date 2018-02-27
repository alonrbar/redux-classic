import { expect } from 'chai';
import { action, ReduxApp, SchemaOptions } from 'src';
import { ComponentActions } from 'src/components';

describe(nameof(ComponentActions), () => {
    describe(nameof(ComponentActions.getActionName), () => {

        it('returns a "lower-cased styled" action name by default', () => {

            class MyComponent {

                @action
                public action(): void {
                    // noop
                }
            }

            const creator = new MyComponent();

            const actionName = ComponentActions.getActionName(creator, nameof(creator.action));
            expect(actionName).to.eql('MyComponent.action');
        });

        it('returns a "redux styled" action name by default when uppercaseActions option is false', () => {

            class MyComponent {

                @action
                public action(): void {
                    // noop
                }
            }

            const creator = new MyComponent();

            const actionName = ComponentActions.getActionName(creator, nameof(creator.action), { uppercaseActions: true });
            expect(actionName).to.eql('MY_COMPONENT.ACTION');
        });

        it(`uses the global ${nameof(SchemaOptions)}`, () => {

            try {

                // set global options before instantiating
                ReduxApp.options.schema.uppercaseActions = true;

                class MyComponent {

                    @action
                    public action(): void {
                        // noop
                    }
                }
    
                const creator = new MyComponent();
    
                const actionName = ComponentActions.getActionName(creator, nameof(creator.action));
                expect(actionName).to.eql('MY_COMPONENT.ACTION');

            } finally {
                // restore defaults
                ReduxApp.options.schema = new SchemaOptions();
            }
        });

    });
});