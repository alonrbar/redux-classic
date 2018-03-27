import { ClassInfo } from '../info';

/**
 * Property decorator.
 * 
 * The property will not be stored in the store.
 */
export function ignoreState(target: object, propertyKey: string | symbol): void {

    const info = ClassInfo.getOrInitInfo(target);
    info.ignoreState[propertyKey] = true;
}

export class IgnoreState {

    public static isIgnoredProperty(propHolder: object, propKey: string | symbol): boolean {
        const info = ClassInfo.getInfo(propHolder);
        return info && info.ignoreState[propKey];
    }

    public static removeIgnoredProps(state: any, obj: any): any {

        const info = ClassInfo.getInfo(obj);
        if (!info)
            return state;

        // remove ignored props
        for (let propKey of Object.keys(info.ignoreState)) {
            delete state[propKey];
        }
        return state;
    }
}