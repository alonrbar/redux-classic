import { createActions } from "./createActions";
import { IActionsMap } from "./types";
import { getStore, StoreId } from "./store";

export function actions<TState, TActions extends IActionsMap<TState>>(actionsMap: TActions, storeId?: StoreId) {
    return (target: any, propertyKey: string | symbol): void => {
        var actionsCache: any;

        if (delete target[propertyKey]) {
            Object.defineProperty(target, propertyKey, {
                get: () => {
                    if (!actionsCache) {
                        var store = getStore(storeId);
                        if (store) {
                            actionsCache = createActions(store.dispatch, actionsMap);
                        }
                    }
                    return actionsCache;
                },
                enumerable: true,
                configurable: true
            });
        }
    };
}

export function state(storeId?: StoreId) {
    return (target: any, propertyKey: string | symbol): void => {
        var lastState: any;

        if (delete target[propertyKey]) {
            Object.defineProperty(target, propertyKey, {
                get: () => {
                    var store = getStore(storeId);
                    if (store) {
                        lastState = store.getState();
                    }
                    return lastState;
                },
                enumerable: true,
                configurable: true
            });
        }
    };
}
