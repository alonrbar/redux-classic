import { WITH_ID, AUTO_ID } from "../symbols";
import { verbose } from "../utils";

export function withId(id?: any): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        if (!target[WITH_ID])
            target[WITH_ID] = {};

        target[WITH_ID][propertyKey] = id || AUTO_ID;
    };
}

var autoComponentId = 0;
export function getComponentId(parent: any, path: string[]): any {

    // no parent
    if (!parent || !path.length)
        return undefined;

    // withID not used
    const idLookup = parent[WITH_ID];
    if (!idLookup)
        return undefined;

    const selfKey = path[path.length - 1];
    const id = parent[WITH_ID][selfKey];

    // the specific component was not assigned an id
    if (!id)
        return undefined;

    // auto id
    if (id === AUTO_ID) {        
        const generatedId = --autoComponentId;  // using negative ids to decrease chance of collision with user assigned ids
        verbose('[getComponentId] new component id generated: ' + generatedId);
        parent[WITH_ID][selfKey] = generatedId;
        return generatedId;
    }

    // manual id
    return id;
}