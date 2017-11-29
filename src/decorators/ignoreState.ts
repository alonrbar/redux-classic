import { ClassInfo } from '../info';
import { IMap } from '../types';

/**
 * Property decorator.
 * Instruct redux-app to not store this property in the store.
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

    public static removeIgnoredProps(state: any, obj: any, ignoredProps: IMap<any>): any {

        const info = ClassInfo.getInfo(obj);
        if (!info)
            return state;

        // populate output parameter
        Object.assign(ignoredProps, info.ignoreState);

        // remove ignored props
        const newState = Object.assign({}, state);
        for (let propKey of Object.keys(info.ignoreState)) {
            delete newState[propKey];
        }
        return newState;
    }
}