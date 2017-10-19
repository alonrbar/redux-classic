import { SchemaOptions } from './options';
import { getArgumentNames, getConstructorProp } from './utils';
import { COMPONENT_SCHEMA, COMPONENT_SCHEMA_OPTIONS } from './symbols';

// tslint:disable:ban-types

//
// public
//

export function component(ctor: Function): any;
export function component(options: SchemaOptions): any; // tslint:disable-line:unified-signatures
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
export function assertComponentSchema(obj: any, msg?: string): void {
    if (!isComponentSchema(obj))
        throw new Error(msg || `Invalid argument. ${nameof(component)} expected.`);
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