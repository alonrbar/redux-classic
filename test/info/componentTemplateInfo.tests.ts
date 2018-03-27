import { expect } from 'chai';
import { action } from 'src';
import { ModuleTemplateInfo } from 'src/info';

// tslint:disable:no-unused-expression

describe(nameof(ModuleTemplateInfo), () => {

    it("ordinary class that extends a component template class is considered a component template", () => {

        class BaseModule {
            @action
            public foo() {
                // noop
            }
        }

        class DerivedClass extends BaseModule {
        }

        const obj = new DerivedClass();
        const templateInfo = ModuleTemplateInfo.getInfo(obj);
        
        expect(templateInfo).to.not.be.null;
        expect(templateInfo).to.not.be.undefined;
    });

    it("derived component template class keeps it's own unique details", () => {

        class BaseModule {
            @action
            public foo() {
                // noop
            }
        }

        class DerivedClass extends BaseModule {
        }

        const base = new BaseModule();
        const derived = new DerivedClass();
        const baseInfo = ModuleTemplateInfo.getInfo(base);
        const derivedInfo = ModuleTemplateInfo.getInfo(derived);
        
        expect(derivedInfo).to.be.instanceof(ModuleTemplateInfo);
        expect(baseInfo).to.be.instanceof(ModuleTemplateInfo);
        expect(derivedInfo).to.not.equal(baseInfo);
    });
});