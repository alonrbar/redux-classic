import { expect } from 'chai';
import { action, ReduxApp, ActionOptions } from 'src';
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

        it('returns a "redux styled" action name when uppercaseActions option is true', () => {
            try {

                // set global options before instantiating
                ReduxApp.options.action.uppercaseActions = true;

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
                ReduxApp.options.action = new ActionOptions();
            }
        });

    });
});