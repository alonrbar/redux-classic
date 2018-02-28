import { Action } from 'redux';
import { ComponentInfo, CreatorInfo, getCreatorMethods } from '../info';
import { globalOptions, ActionOptions } from '../options';
import { IMap, Method } from '../types';
import { Component } from './component';
var snakecase = require('lodash.snakecase');

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
            componentActions[key] = function (this: Component, ...payload: any[]): void {

                // verify 'this' arg
                if (!(this instanceof Component))
                    throw new Error(`Component method invoked with non-Component as 'this'. Bound 'this' argument is: ${this}`);

                const oldMethod = methods[key];

                // handle actions and sequences (use store dispatch)
                if (creatorInfo.actions[key] || creatorInfo.sequences[key]) {
                    const compInfo = ComponentInfo.getInfo(this);
                    const action: ReduxAppAction = {
                        type: ComponentActions.getActionName(creator, key),
                        id: (compInfo ? compInfo.id : undefined),
                        payload: payload
                    };
                    compInfo.dispatch(action);
                }

                // handle regular methods (just call the function)
                if (!creatorInfo.actions[key]) {
                    return oldMethod.call(this, ...payload);
                }
            };
        });

        return componentActions;
    }

    public static getActionName(creator: object, methodName: string): string {
        const options = Object.assign(new ActionOptions(), globalOptions.action);

        var actionName = methodName;
        var actionNamespace = creator.constructor.name;

        if (options.uppercaseActions) {
            actionName = snakecase(actionName).toUpperCase();
            actionNamespace = snakecase(actionNamespace).toUpperCase();
        }

        if (options.actionNamespace) {
            actionName = actionNamespace + options.actionNamespaceSeparator + actionName;
        }

        return actionName;
    }
}