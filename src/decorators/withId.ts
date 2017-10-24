import { Schema } from '../components';
import { AUTO_ID } from '../symbols';
import { log } from '../utils';

export function withId(id?: any): PropertyDecorator {
    return (target: object, propertyKey: string | symbol) => {
        const schema = Schema.getOrCreateSchema(target);
        schema.childIds[propertyKey] = id || AUTO_ID;
    };
}

export class ComponentId {

    private static autoComponentId = 0;

    public static getComponentId(parentCreator: object, path: string[]): any {

        //
        // Note: The component id is first stored on it's parent. It can be only
        // assigned to it once the component itself has been constructed. The
        // differed assigned resolves situations where the component is created
        // inside it's parent constructor or injected via DI. For some reason,
        // getter and setter did not solve this problem so this solution was
        // chosen.
        //

        const schema = Schema.getSchema(parentCreator);

        // no parent
        if (!parentCreator || !path.length)
            return undefined;

        const selfKey = path[path.length - 1];
        const id = schema.childIds[selfKey];

        // the specific component was not assigned an id
        if (!id)
            return undefined;

        // auto id
        if (id === AUTO_ID) {
            const generatedId = --ComponentId.autoComponentId;  // using negative ids to decrease chance of collision with user assigned ids
            log.verbose('[getComponentId] new component id generated: ' + generatedId);
            schema.childIds[selfKey] = generatedId;
            return generatedId;
        }

        // manual id
        return id;
    }
}