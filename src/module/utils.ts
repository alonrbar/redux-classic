import { ModuleInfo } from '../info';

// tslint:disable-next-line:ban-types
export function isInstanceOf(obj: any, type: Function): boolean {
    if (obj instanceof type)
        return true;

    const info = ModuleInfo.getInfo(obj);
    return !!(info && info.originalClass === type);
}