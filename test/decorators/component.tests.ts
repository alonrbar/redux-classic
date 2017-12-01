import { expect } from 'chai';
import { component } from 'src';
import { CreatorInfo } from 'src/info';

// tslint:disable:no-unused-expression

describe(nameof(component), () => {

    it(`default options are undefined`, () => {

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
        expect(info.options).to.be.undefined;
    });    

    it(`uses ad-hoc options`, () => {

        // instantiate component creator
        const options = { uppercaseActions: false };
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