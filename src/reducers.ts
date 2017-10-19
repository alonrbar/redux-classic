import { AnyAction, ReducersMapObject } from 'redux';

/**
 * A simple version of redux combineReducers with no assertions or warnings.
 * @see https://raw.githubusercontent.com/reactjs/redux/master/src/combineReducers.js
 */
export function simpleCombineReducers(reducers: ReducersMapObject): any {
    const reducerKeys = Object.keys(reducers);

    return function combination(state: any = {}, action: AnyAction) {
        let hasChanged = false;
        const nextState: any = {};
        for (let key of reducerKeys) {
            const reducer = reducers[key];
            const previousStateForKey = state[key];
            const nextStateForKey = reducer(previousStateForKey, action);
            nextState[key] = nextStateForKey;
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        }
        return hasChanged ? nextState : state;
    }
}