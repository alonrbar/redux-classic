import { Component } from '../components';
import { AUTO_ID, COMPONENT_ID, setSymbol, WITH_ID } from '../symbols';
import { log } from '../utils';

export function withId(id?: any): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        if (!target[WITH_ID])
            target[WITH_ID] = {};

        target[WITH_ID][propertyKey] = id || AUTO_ID;
    };
}

export class ComponentId {

    private static autoComponentId = 0;

    public static setComponentId(component: Component<any>, parent: Component<any>, path: string[]): void {

        //
        // Note: The component id is first stored on it's parent. It can be only
        // assigned to it once the component itself has been constructed. The
        // differed assigned resolves situations where the component is created
        // inside it's parent constructor or injected via DI. For some reason,
        // getter and setter did not solve this problem so this solution was
        // chosen.
        //

        const componentId = ComponentId.getComponentId(parent, path);
        if (componentId !== undefined && componentId !== null) {
            setSymbol(component, COMPONENT_ID, componentId);
        }
    }

    private static getComponentId(parent: Component<any>, path: string[]): any {

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
            const generatedId = --ComponentId.autoComponentId;  // using negative ids to decrease chance of collision with user assigned ids
            log.verbose('[getComponentId] new component id generated: ' + generatedId);
            anyParent[WITH_ID][selfKey] = generatedId;
            return generatedId;
        }

        // manual id
        return id;
    }
}