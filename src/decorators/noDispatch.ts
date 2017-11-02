import { CreatorInfo } from '../info';

/**
 * Method decorator.
 * Instruct redux-app to keep this method as is and not to replace it with invocation of store.dispatch.
 * Alias of 'sequence'.
 */
export function noDispatch(target: object, propertyKey: string | symbol): void {
    noDispatchDecorator(target, propertyKey);
}

/**
 * Method decorator.
 * Instruct redux-app to keep this method as is and not to replace it with invocation of store.dispatch.
 * Alias of 'noDispatch'.
 */
export function sequence(target: object, propertyKey: string | symbol): void {
    noDispatchDecorator(target, propertyKey);
}

function noDispatchDecorator(target: object, propertyKey: string | symbol): void {
    const info = CreatorInfo.getOrInitInfo(target);
    info.noDispatch[propertyKey] = true;
}