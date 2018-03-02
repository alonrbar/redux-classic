import { expect } from 'chai';
import { action } from 'src';
import { ComponentTemplateInfo } from 'src/info';

// tslint:disable:no-unused-expression

describe(nameof(ComponentTemplateInfo), () => {

    it("ordinary class that extends a component template class is considered a component template", () => {

        class BaseComponent {
            @action
            public foo() {
                // noop
            }
        }

        class DerivedClass extends BaseComponent {
        }

        const obj = new DerivedClass();
        const templateInfo = ComponentTemplateInfo.getInfo(obj);
        
        expect(templateInfo).to.not.be.null;
        expect(templateInfo).to.not.be.undefined;
    });
});