
export function setSymbol<T>(obj: any, symbol: symbol, value: T): T {
    return obj[symbol] = value;
}

export function getSymbol(obj: any, symbol: symbol): any {
    return obj[symbol];
}

export const COMPONENT_META = Symbol('REDUX-APP.COMPONENT_METADATA');
export const COMPONENT_SCHEMA = Symbol('REDUX-APP.COMPONENT_SCHEMA');
export const AUTO_ID = Symbol('REDUX-APP.AUTO_ID');