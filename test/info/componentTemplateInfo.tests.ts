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

    it("derived component template class keeps it's own unique details", () => {

        class BaseComponent {
            @action
            public foo() {
                // noop
            }
        }

        class DerivedClass extends BaseComponent {
        }

        const base = new BaseComponent();
        const derived = new DerivedClass();
        const baseInfo = ComponentTemplateInfo.getInfo(base);
        const derivedInfo = ComponentTemplateInfo.getInfo(derived);
        
        expect(derivedInfo).to.be.instanceof(ComponentTemplateInfo);
        expect(baseInfo).to.be.instanceof(ComponentTemplateInfo);
        expect(derivedInfo).to.not.equal(baseInfo);
    });
});