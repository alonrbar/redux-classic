import { Action } from 'redux';
import { ComponentInfo, CreatorInfo, getCreatorMethods } from '../info';
import { getActionName } from '../options';
import { IMap, Method } from '../types';
import { Component } from './component';

// tslint:disable-next-line:interface-name
export interface ReduxAppAction extends Action {
    id: any;
    payload: any[];
}

export class ComponentActions {

    public static createActions(creator: object): IMap<Method> {
        const methods = getCreatorMethods(creator);
        if (!methods)
            return undefined;

        const creatorInfo = CreatorInfo.getInfo(creator);
        const componentActions: any = {};
        Object.keys(methods).forEach(key => {
            componentActions[key] = function (this: Component<object>, ...payload: any[]): void {

                // verify 'this' arg
                if (!(this instanceof Component))
                    throw new Error(`Component method invoked with non-Component as 'this'. Bound 'this' argument is: ${this}`);

                const oldMethod = methods[key];
                if (creatorInfo.noDispatch[key]) {

                    // handle non-dispatch methods (just call the function)
                    return oldMethod.call(this, ...payload);
                } else {

                    // handle dispatch methods (use store dispatch)
                    const compInfo = ComponentInfo.getInfo(this);
                    const action: ReduxAppAction = {
                        type: getActionName(creator, key, creatorInfo.options),
                        id: (compInfo ? compInfo.id : undefined),
                        payload: payload
                    };
                    compInfo.dispatch(action);
                }
            };
        });

        return componentActions;
    }
}