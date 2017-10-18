import { getArgumentNames } from "./utils";

export const COMPONENT_SCHEMA = Symbol('COMPONENT_SCHEMA');

export const componentSchema: ClassDecorator = (ctor: Function) => {
    if (getArgumentNames(ctor).length)
        throw new Error('componentSchema classes must have a parameter-less constructor');

    (ctor as any)[COMPONENT_SCHEMA] = true;
}

export function isComponentSchema(obj: any): boolean {
    return obj && obj.constructor && obj.constructor[COMPONENT_SCHEMA];
}