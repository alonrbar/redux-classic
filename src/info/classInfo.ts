import { CLASS_INFO, getSymbol, setSymbol } from '../symbols';
import { IMap } from '../types';

/**
 * Metadata stored on instances of regular and/or module classes.
 */
export class ClassInfo {

    public static getInfo(obj: object): ClassInfo {
        if (!obj)
            return undefined;

        return getSymbol(obj, CLASS_INFO);
    }

    public static getOrInitInfo(obj: object): ClassInfo {

        // get previous
        var info = ClassInfo.getInfo(obj);

        // create if no previous
        if (!info) {
            info = setSymbol(obj, CLASS_INFO, new ClassInfo());
        }

        return info;
    }

    public ignoreState: IMap<boolean> = {};
}