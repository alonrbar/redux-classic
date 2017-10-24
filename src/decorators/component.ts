import { SchemaOptions } from '../options';
import { COMPONENT_SCHEMA, COMPONENT_SCHEMA_OPTIONS, setSymbol } from '../symbols';

// tslint:disable:ban-types

/**
 * Class decorator.
 */
export function component(ctor: Function): any;
export function component(options: SchemaOptions): any; // tslint:disable-line:unified-signatures
export function component(ctorOrOptions: Function | SchemaOptions): any {
    if (typeof ctorOrOptions === 'function') {
        componentSchemaDecorator.call(undefined, ctorOrOptions);
    } else {
        return (ctor: Function) => componentSchemaDecorator(ctor, ctorOrOptions);
    }
}

function componentSchemaDecorator(ctor: Function, options?: SchemaOptions) {
    setSymbol(ctor, COMPONENT_SCHEMA, true);
    setSymbol(ctor, COMPONENT_SCHEMA_OPTIONS, options);
}