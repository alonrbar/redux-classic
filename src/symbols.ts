//
// utils
//

export function setSymbol(obj: any, symbol: symbol, value: any) {
    return obj[symbol] = value;
}

export function getSymbol(obj: any, symbol: symbol): any {
    return obj[symbol];
}

//
// component symbols
//

export const REDUCER = Symbol('REDUX-APP.COMPONENT.REDUCER');
export const DISPOSE = Symbol('REDUX-APP.COMPONENT.DISPOSE');
export const COMPONENT_ID = Symbol('REDUX-APP.COMPONENT.ID');

//
// component schema symbols
//

export const COMPONENT_SCHEMA = Symbol('REDUX-APP.COMPONENT_SCHEMA');
export const COMPONENT_SCHEMA_OPTIONS = Symbol('REDUX-APP.COMPONENT_SCHEMA.OPTIONS');
export const NO_DISPATCH = Symbol('REDUX-APP.COMPONENT_SCHEMA.NO_DISPATCH');
export const COMPUTED = Symbol('REDUX-APP.COMPONENT_SCHEMA.COMPUTED');

//
// component's parent symbols
//

export const WITH_ID = Symbol('REDUX-APP.COMPONENT_SCHEMA.WITH_ID');
export const AUTO_ID = Symbol('REDUX-APP.COMPONENT_SCHEMA.AUTO_ID');