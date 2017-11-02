import { CLASS_INFO, getSymbol, setSymbol } from '../symbols';
import { Getter, IMap } from '../types';

/**
 * Metadata stored on instances of regular classes for various redux-app needs.
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

    public computedGetters: IMap<Getter> = {};
    public connectedProps: IMap<boolean> = {};
}