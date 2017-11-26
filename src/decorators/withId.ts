import { CreatorInfo } from '../info';
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
    const info = CreatorInfo.getOrInitInfo(target);
    info.childIds[propertyKey] = id || AUTO_ID;
}

export class ComponentId {

    private static autoComponentId = 0;

    public static nextAvailableId(): any {
        return --ComponentId.autoComponentId; // using negative ids to decrease chance of collision with user assigned ids
    }

    public static getComponentId(parentCreator: object, path: string): any {

        //
        // Note: The component id is first stored on it's parent. It can be only
        // assigned to it once the component itself has been constructed. The
        // differed assigned resolves situations where the component is created
        // inside it's parent constructor or injected via DI. This could have
        // been solved with custom getter and setter but decided to go with this
        // approach here.
        //

        // no parent
        const pathArray = path.split('.');
        if (!parentCreator || !pathArray.length)
            return undefined;

        // parent is not a component creator
        const info = CreatorInfo.getInfo(parentCreator);
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