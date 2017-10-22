import { SchemaOptions } from '../options';
import { getConstructorProp } from '../utils';
import { COMPONENT_SCHEMA, COMPONENT_SCHEMA_OPTIONS } from '../symbols';
import { INewable } from '../types';

//
// public
//

/**
 * Class decorator.
 */
export function component<T>(ctor: INewable<T>): T;
export function component(options: SchemaOptions): any; // tslint:disable-line:unified-signatures
export function component(ctorOrOptions: INewable<any> | SchemaOptions): any {
    if (typeof ctorOrOptions === 'function') {
        componentSchemaDecorator.call(undefined, ctorOrOptions);
    } else {        
        return (ctor: INewable<any>) => componentSchemaDecorator(ctor, ctorOrOptions);
    }
}

export function isComponentSchema(obj: object): boolean {
    return getConstructorProp(obj, COMPONENT_SCHEMA);
}

/**
 * Throws if 'obj' is not a componentSchema.
 */
export function assertComponentSchema(obj: object, msg?: string): void {
    if (!isComponentSchema(obj))
        throw new Error(msg || `Invalid argument. ${nameof(component)} expected.`);
}

//
// private
//

function componentSchemaDecorator(ctor: INewable<any>, options?: SchemaOptions) {
    (ctor as any)[COMPONENT_SCHEMA] = true;
    (ctor as any)[COMPONENT_SCHEMA_OPTIONS] = options;
}