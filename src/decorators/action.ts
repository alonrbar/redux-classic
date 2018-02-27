import { CreatorInfo } from '../info';

/**
 * Method decorator.
 * 
 * Mark this method as a Redux action.
 */
export function action(target: object, propertyKey: string | symbol): void {
    const info = CreatorInfo.getOrInitInfo(target);
    info.actions[propertyKey] = true;
}