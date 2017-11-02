import { Action } from 'redux';
import { ComponentInfo, CreatorInfo } from '../info';
import { getActionName } from '../options';
import { IMap, Method } from '../types';
import { getMethods } from '../utils';
import { Component } from './component';

// tslint:disable-next-line:interface-name
export interface ReduxAppAction extends Action {
    id: any;
    payload: any[];
}

export class ComponentActions implements IMap<Method> {

    [key: string]: Method;

    constructor(creator: object) {
        const methods = getMethods(creator);
        if (!methods)
            return undefined;

        const creatorInfo = CreatorInfo.getInfo(creator);
        Object.keys(methods).forEach(key => {
            this[key] = function (this: Component<object>, ...payload: any[]): void {

                // verify 'this' arg
                if (!(this instanceof Component))
                    throw new Error(`Component method invoked with non-Component as 'this'. Bound 'this' argument is: ${this}`);

                const oldMethod = methods[key];
                if (creatorInfo.noDispatch[key]) {

                    // handle non-dispatch methods (just call the function)
                    oldMethod.call(this, ...payload);
                } else {

                    // handle dispatch methods (use store dispatch)
                    const compInfo = ComponentInfo.getInfo(this);
                    const action: ReduxAppAction = {
                        type: getActionName(creator, key, creatorInfo.options),
                        id: compInfo.id,
                        payload: payload
                    };
                    compInfo.dispatch(action);
                }
            };
        });
    }
}