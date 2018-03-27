import { ModuleTemplateInfo } from '../info';

/**
 * Method decorator. 
 *
 * The method will dispatch an action with the corresponding name but the
 * dispatched action will **not** trigger a reducer reaction. Instead, after the
 * dispatch process is done the method will be invoked as a standard js method.
 */
export function sequence(target: object, propertyKey: string | symbol): void {
    const info = ModuleTemplateInfo.getOrInitInfo(target);
    info.sequences[propertyKey] = true;
}