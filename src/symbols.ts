
export function isSymbol(obj: any): obj is symbol {
    return typeof obj === 'symbol' || obj instanceof Symbol;
}

export function setSymbol<T>(obj: any, symbol: symbol, value: T): T {
    return obj[symbol] = value;
}

export function getSymbol(obj: any, symbol: symbol): any {
    return obj[symbol];
}

export function getOwnSymbol(obj: any, symbol: symbol): any {
    return Object.getOwnPropertySymbols(obj).includes(symbol) && getSymbol(obj, symbol);
}

/**
 * Stored on component instances.
 */
export const COMPONENT_INFO = Symbol('REDUX-APP.COMPONENT_INFO');
/**
 * Stored on component templates constructors.
 */
export const COMPONENT_TEMPLATE_INFO = Symbol('REDUX-APP.COMPONENT_TEMPLATE_INFO');
/**
 * Stored on any class constructor.
 */
export const CLASS_INFO = Symbol('REDUX-APP.CLASS_INFO');
export const AUTO_ID = Symbol('REDUX-APP.AUTO_ID');
