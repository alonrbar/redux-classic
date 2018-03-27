import { ModuleTemplateInfo } from '../info';

/**
 * Method decorator.
 * 
 * Mark this method as a Redux action.
 */
export function action(target: object, propertyKey: string | symbol): void {
    const info = ModuleTemplateInfo.getOrInitInfo(target);
    info.actions[propertyKey] = true;
}