import { CreatorInfo } from '../info';
import { SchemaOptions } from '../options';

// tslint:disable:ban-types

/**
 * Class decorator.
 */
export function component(ctor: Function): any;
export function component(options: SchemaOptions): any; // tslint:disable-line:unified-signatures
export function component(ctorOrOptions: Function | SchemaOptions): any {
    if (typeof ctorOrOptions === 'function') {
        componentDecorator.call(undefined, ctorOrOptions);
    } else {
        return (ctor: Function) => componentDecorator(ctor, ctorOrOptions);
    }
}

function componentDecorator(ctor: Function, options?: SchemaOptions) {
    const info = CreatorInfo.getOrInitInfo(ctor);
    info.options = options;
}