import { NO_DISPATCH } from "./symbols";

/**
 * Method decorator.
 * Instruct redux-app to keep this method as is and not to replace it with invocation of store.dispatch.
 * Alias of 'sequence'.
 */
export function noDispatch(target: any, propertyKey: string | symbol): void {
    noDispatchDecorator(target, propertyKey);
}

/**
 * Method decorator.
 * Instruct redux-app to keep this method as is and not to replace it with invocation of store.dispatch.
 * Alias of 'noDispatch'.
 */
export function sequence(target: any, propertyKey: string | symbol): void {
    noDispatchDecorator(target, propertyKey);
}

function noDispatchDecorator(target: any, propertyKey: string | symbol): void {
    target[propertyKey][NO_DISPATCH] = true;
}