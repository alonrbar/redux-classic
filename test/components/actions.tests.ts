import { expect } from 'chai';
import { component, ReduxApp, SchemaOptions } from 'src';
import { ComponentActions } from 'src/components';

describe(nameof(ComponentActions), () => {
    describe(nameof(ComponentActions.getActionName), () => {

        it('returns a "redux styled" action name by default', () => {

            @component
            class MyComponent {
                public action(): void {
                    // noop
                }
            }

            const creator = new MyComponent();

            const actionName = ComponentActions.getActionName(creator, nameof(creator.action));
            expect(actionName).to.eql('MY_COMPONENT.ACTION');
        });

        it('returns a "lower-cased styled" action name when uppercaseActions option is false', () => {

            @component
            class MyComponent {
                public action(): void {
                    // noop
                }
            }

            const creator = new MyComponent();

            const actionName = ComponentActions.getActionName(creator, nameof(creator.action), { uppercaseActions: false });
            expect(actionName).to.eql('MyComponent.action');
        });

        it(`uses the global ${nameof(SchemaOptions)}`, () => {

            try {

                // set global options before instantiating
                ReduxApp.options.schema.uppercaseActions = false;

                @component
                class MyComponent {
                    public action(): void {
                        // noop
                    }
                }
    
                const creator = new MyComponent();
    
                const actionName = ComponentActions.getActionName(creator, nameof(creator.action));
                expect(actionName).to.eql('MyComponent.action');

            } finally {
                // restore defaults
                ReduxApp.options.schema = new SchemaOptions();
            }
        });

    });
});