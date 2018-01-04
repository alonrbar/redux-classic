import { CreatorInfo } from '../info';

/**
 * Method decorator.
 * 
 * Instruct redux-app to keep this method as is and not to replace it with invocation of store.dispatch.
 */
export function noDispatch(target: object, propertyKey: string | symbol): void {
    const info = CreatorInfo.getOrInitInfo(target);
    info.noDispatch[propertyKey] = true;
}