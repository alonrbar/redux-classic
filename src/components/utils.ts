import { Metadata } from './metadata';

// tslint:disable-next-line:ban-types
export function isInstanceOf(obj: any, type: Function) {
    if (obj instanceof type)
        return true;

    const meta = Metadata.getMeta(obj);
    return !!(meta && meta.originalClass === type);
}