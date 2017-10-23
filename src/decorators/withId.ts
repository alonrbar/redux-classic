import { Component } from '../components';
import { AUTO_ID, COMPONENT_ID, setSymbol, WITH_ID } from '../symbols';
import { log } from '../utils';

//
// Note:
//
// The component id is stored on it's parent. This resolves situations when the
// component is created inside it's parent constructor or injected via DI. For
// some reason, getter and setter did not solve this problem so this solution
// was chosen.
//

export function withId(id?: any): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        if (!target[WITH_ID])
            target[WITH_ID] = {};

        target[WITH_ID][propertyKey] = id || AUTO_ID;
    };
}

export function setComponentId(component: Component<any>, parent: Component<any>, path: string[]): void {
    const componentId = getComponentId(parent, path);
    if (componentId !== undefined && componentId !== null) {
        setSymbol(component, COMPONENT_ID, componentId);
    }
}

var autoComponentId = 0;
function getComponentId(parent: Component<any>, path: string[]): any {

    const anyParent = (parent as any);

    // no parent
    if (!parent || !path.length)
        return undefined;

    // withID not used
    const idLookup = anyParent[WITH_ID];
    if (!idLookup)
        return undefined;

    const selfKey = path[path.length - 1];
    const id = anyParent[WITH_ID][selfKey];

    // the specific component was not assigned an id
    if (!id)
        return undefined;

    // auto id
    if (id === AUTO_ID) {        
        const generatedId = --autoComponentId;  // using negative ids to decrease chance of collision with user assigned ids
        log.verbose('[getComponentId] new component id generated: ' + generatedId);
        anyParent[WITH_ID][selfKey] = generatedId;
        return generatedId;
    }

    // manual id
    return id;
}