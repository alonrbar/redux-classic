import { ComponentInfo } from './componentInfo';

// tslint:disable-next-line:ban-types
export function isInstanceOf(obj: any, type: Function): boolean {
    if (obj instanceof type)
        return true;

    const info = ComponentInfo.getInfo(obj);
    return !!(info && info.originalClass === type);
}