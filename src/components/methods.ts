import { IMap, Method } from '../types';
import { getMethods } from '../utils';
import { CreatorInfo } from '../info';

export function getComponentMethods(obj: object, inherit = true): IMap<Method> {

    // skip non-components
    
    if (!CreatorInfo.getInfo(obj))
        return {};

    // without inheritance

    if (!inherit)
        return getMethods(obj);

    // with inheritance

    var finalMethods = {};
    var objMethods = getMethods(obj);
    while (obj) {

        finalMethods = Object.assign({}, objMethods, finalMethods);
        obj = Object.getPrototypeOf(obj);
        objMethods = getComponentMethods(obj);
    }

    return finalMethods;
}