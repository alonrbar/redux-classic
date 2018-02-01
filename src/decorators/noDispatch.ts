import { CreatorInfo } from '../info';

/**
 * Method decorator.
 * 
 * Mark this method as a simple js method (not dispatching an action).
 */
export function noDispatch(target: object, propertyKey: string | symbol): void {
    const info = CreatorInfo.getOrInitInfo(target);
    info.noDispatch[propertyKey] = true;
}