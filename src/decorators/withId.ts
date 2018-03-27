import { ModuleTemplateInfo } from '../info';
import { AUTO_ID } from '../symbols';
import { log } from '../utils';

/**
 * Property decorator.
 */
export function withId(id?: any): PropertyDecorator;
export function withId(target: object, propertyKey: string | symbol): void;
export function withId(targetOrId: any, propertyKeyOrNothing?: string | symbol): any {
    if (propertyKeyOrNothing) {
        withIdDecorator.call(undefined, targetOrId, propertyKeyOrNothing);
    } else {
        return (target: object, propertyKey: string | symbol) => withIdDecorator(target, propertyKey, targetOrId);
    }
}

function withIdDecorator(target: object, propertyKey: string | symbol, id?: any) {
    const info = ModuleTemplateInfo.getOrInitInfo(target);
    info.childIds[propertyKey] = id || AUTO_ID;
}

export class ModuleId {

    private static autoModuleId = 0;

    public static nextAvailableId(): any {
        return --ModuleId.autoModuleId; // using negative ids to decrease chance of collision with user assigned ids
    }

    public static getModuleId(parentTemplate: object, path: string): any {

        //
        // Note: The module id is first stored on it's parent. It is only
        // assigned to it once the module itself has been constructed. The
        // differed assignment resolves situations where the module`s template
        // is created inside it's parent constructor or injected via DI. This
        // could have also been resolved with custom getter and setter but
        // this approach feels less intrusive.
        //

        // no parent
        const pathArray = path.split('.');
        if (!parentTemplate || !pathArray.length)
            return undefined;

        // parent is not a module template
        const info = ModuleTemplateInfo.getInfo(parentTemplate);
        if (!info)
            return;

        const selfKey = pathArray[pathArray.length - 1];
        const id = info.childIds[selfKey];

        // the specific module was not assigned an id
        if (!id)
            return undefined;

        // auto id
        if (id === AUTO_ID) {
            const generatedId = ModuleId.nextAvailableId();
            log.verbose('[getModuleId] new module id generated: ' + generatedId);
            info.childIds[selfKey] = generatedId;
            return generatedId;
        }

        // manual id
        return id;
    }
}