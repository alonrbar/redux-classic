import { COMPONENT_SCHEMA_OPTIONS, SchemaOptions } from './options';
import { getArgumentNames, getConstructorProp } from './utils';

// tslint:disable:ban-types

//
// symbols
//

const COMPONENT_SCHEMA = Symbol('COMPONENT_SCHEMA');

//
// public
//

export function component(ctorOrOptions: Function | SchemaOptions): any {
    if (typeof ctorOrOptions === 'function') {
        componentSchemaDecorator.call(undefined, ctorOrOptions);
    } else {        
        return (ctor: Function) => componentSchemaDecorator(ctor, ctorOrOptions);
    }
}

export function isComponentSchema(obj: any): boolean {
    return getConstructorProp(obj, COMPONENT_SCHEMA);
}

/**
 * Throws if 'obj' is not a componentSchema.
 */
export function assertComponentSchema(obj: any): void {
    if (!isComponentSchema(obj))
        throw new Error(`Invalid argument. ${nameof(component)} expected.`);
}

//
// private
//

function componentSchemaDecorator(ctor: Function, options?: SchemaOptions) {
    if (getArgumentNames(ctor).length)
        throw new Error('componentSchema classes must have a parameter-less constructor');

    (ctor as any)[COMPONENT_SCHEMA] = true;
    (ctor as any)[COMPONENT_SCHEMA_OPTIONS] = options;
}