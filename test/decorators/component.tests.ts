import { expect } from 'chai';
import { component, SchemaOptions, ReduxApp } from 'src';
import { CreatorInfo } from 'src/info';

// tslint:disable:no-unused-expression

describe(nameof(component), () => {

    it(`uses the default ${nameof(SchemaOptions)}`, () => {

        // instantiate component creator
        @component
        class MyComponent {
            public action(): void {
                // noop
            }
        }
        const creator = new MyComponent();

        // assert
        const info = CreatorInfo.getInfo(creator);
        expect(info.options).to.be.eql(new SchemaOptions());
        expect(info.options.uppercaseActions).to.be.true;
    });

    it(`uses the global ${nameof(SchemaOptions)}`, () => {

        try {

            // set global options before instantiating
            ReduxApp.options.schema.uppercaseActions = false;

            // instantiate component creator
            @component
            class MyComponent {
                public action(): void {
                    // noop
                }
            }
            const creator = new MyComponent();

            // assert
            const info = CreatorInfo.getInfo(creator);
            expect(info.options).to.be.eql(ReduxApp.options.schema);
            expect(info.options.uppercaseActions).to.be.false;

        } finally {
            // restore defaults
            ReduxApp.options.schema = new SchemaOptions();
        }
    });

    it(`uses ad-hoc ${nameof(SchemaOptions)}`, () => {

        // instantiate component creator
        const options = Object.assign(new SchemaOptions(), { uppercaseActions: false });
        @component(options)
        class MyComponent {
            public action(): void {
                // noop
            }
        }
        const creator = new MyComponent();

        // assert
        const info = CreatorInfo.getInfo(creator);
        expect(info.options).to.be.eql(options);
        expect(info.options.uppercaseActions).to.be.false;
    });

});