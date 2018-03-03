import { ComponentTemplateInfo } from '../info';
import { AUTO_ID } from '../symbols';
import { log } from '../utils';

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
    const info = ComponentTemplateInfo.getOrInitInfo(target);
    info.childIds[propertyKey] = id || AUTO_ID;
}

export class ComponentId {

    private static autoComponentId = 0;

    public static nextAvailableId(): any {
        return --ComponentId.autoComponentId; // using negative ids to decrease chance of collision with user assigned ids
    }

    public static getComponentId(parentTemplate: object, path: string): any {

        //
        // Note: The component id is first stored on it's parent. It is only
        // assigned to it once the component itself has been constructed. The
        // differed assignment resolves situations where the component`s
        // template is created inside it's parent constructor or injected via
        // DI. This could have also been resolved with custom getter and setter
        // but decided to take this approach here.
        //

        // no parent
        const pathArray = path.split('.');
        if (!parentTemplate || !pathArray.length)
            return undefined;

        // parent is not a component template
        const info = ComponentTemplateInfo.getInfo(parentTemplate);
        if (!info)
            return;

        const selfKey = pathArray[pathArray.length - 1];
        const id = info.childIds[selfKey];

        // the specific component was not assigned an id
        if (!id)
            return undefined;

        // auto id
        if (id === AUTO_ID) {
            const generatedId = ComponentId.nextAvailableId();
            log.verbose('[getComponentId] new component id generated: ' + generatedId);
            info.childIds[selfKey] = generatedId;
            return generatedId;
        }

        // manual id
        return id;
    }
}