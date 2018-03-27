import { expect } from 'chai';
import { action, ActionOptions, ReduxClassic } from 'src';
import { ModuleActions } from 'src/module';

describe(nameof(ModuleActions), () => {
    describe(nameof(ModuleActions.getActionName), () => {

        it('returns a "lower-cased styled" action name by default', () => {

            class MyModule {

                @action
                public action(): void {
                    // noop
                }
            }

            const creator = new MyModule();

            const actionName = ModuleActions.getActionName(creator, nameof(creator.action));
            expect(actionName).to.eql('MyModule.action');
        });

        it('returns a "redux styled" action name when uppercaseActions option is true', () => {
            try {

                // set global options before instantiating
                ReduxClassic.options.action.uppercaseActions = true;

                class MyModule {

                    @action
                    public action(): void {
                        // noop
                    }
                }
    
                const creator = new MyModule();
    
                const actionName = ModuleActions.getActionName(creator, nameof(creator.action));
                expect(actionName).to.eql('MY_MODULE.ACTION');

            } finally {
                // restore defaults
                ReduxClassic.options.action = new ActionOptions();
            }
        });

    });
});