import { IMap, Method } from '../types';
import { getMethods, getParentType } from '../utils';
import { CreatorInfo } from '../info';

// tslint:disable:ban-types

export function getCreatorMethods(obj: object | Function, inherit = true): IMap<Method> {

    // ignore non-components
    if (!CreatorInfo.getInfo(obj))
        return undefined;

    // get methods
    var methods = getMethods(obj);
    if (inherit) {

        // with inheritance
        var parentType = getParentType(obj);
        while (parentType !== Object) {
            var parentMethods = getCreatorMethods(parentType, false);
            methods = Object.assign({}, parentMethods, methods);
            parentType = getParentType(parentType);
        }
    }

    return methods;
}