import { Store } from "redux";

const DEFAULT_STORE_KEY = Symbol('DEFAULT_STORE');

interface IStoresMap {
    [storeId: string]: Store<any>;
}

const storesRepository: IStoresMap = {};

export type StoreId = string | symbol;

export function getStore(key?: StoreId) {    
    console.warn('getStore');
    return storesRepository[key || DEFAULT_STORE_KEY];
}

export function setStore(store: Store<any>, key?: StoreId) {
    key = key || DEFAULT_STORE_KEY;
    if (storesRepository[key])
        throw new Error(`Store '${key}' already exists in the stores repository`);

    storesRepository[key] = store;
}