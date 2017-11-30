import { expect } from 'chai';
import { component, SchemaOptions } from 'src';
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
        expect(info.options.uppercaseActions).to.be.undefined;
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