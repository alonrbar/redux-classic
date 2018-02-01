import { CreatorInfo } from '../info';

export const noDispatch = method;

/**
 * Method decorator.
 * 
 * Mark this method as a simple js method (not dispatching an action).
 */
export function method(target: object, propertyKey: string | symbol): void {
    const info = CreatorInfo.getOrInitInfo(target);
    info.method[propertyKey] = true;
}