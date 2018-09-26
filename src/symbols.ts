
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
 * Stored on module instances.
 */
export const MODULE_INFO = Symbol('REDUX-CLASSIC.MODULE_INFO');
/**
 * Stored on module templates constructors.
 */
export const MODULE_TEMPLATE_INFO = Symbol('REDUX-CLASSIC.MODULE_TEMPLATE_INFO');
/**
 * Stored on any class constructor.
 */
export const CLASS_INFO = Symbol('REDUX-CLASSIC.CLASS_INFO');