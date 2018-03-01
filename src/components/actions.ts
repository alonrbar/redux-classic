import { Action } from 'redux';
import { ComponentInfo, ComponentTemplateInfo } from '../info';
import { ActionOptions, globalOptions } from '../options';
import { IMap, Method } from '../types';
import { getMethods } from '../utils';
import { Component } from './component';
var snakecase = require('lodash.snakecase');

// tslint:disable-next-line:interface-name
export interface ReduxAppAction extends Action {
    id: any;
    payload: any[];
}

export class ComponentActions {

    public static createActions(template: object): IMap<Method> {
        const methods = getMethods(template);
        if (!methods)
            return undefined;

        const templateInfo = ComponentTemplateInfo.getInfo(template);
        const componentActions: any = {};
        Object.keys(methods).forEach(key => {
            componentActions[key] = function (this: Component, ...payload: any[]): void {

                // verify 'this' arg
                if (!(this instanceof Component))
                    throw new Error(`Component method invoked with non-Component as 'this'. Bound 'this' argument is: ${this}`);

                const oldMethod = methods[key];

                // handle actions and sequences (use store dispatch)
                if (templateInfo.actions[key] || templateInfo.sequences[key]) {
                    const compInfo = ComponentInfo.getInfo(this);
                    const action: ReduxAppAction = {
                        type: ComponentActions.getActionName(template, key),
                        id: (compInfo ? compInfo.id : undefined),
                        payload: payload
                    };
                    compInfo.dispatch(action);
                }

                // handle regular methods (just call the function)
                if (!templateInfo.actions[key]) {
                    return oldMethod.call(this, ...payload);
                }
            };
        });

        return componentActions;
    }

    public static getActionName(template: object, methodName: string): string {
        const options = Object.assign(new ActionOptions(), globalOptions.action);

        var actionName = methodName;
        var actionNamespace = template.constructor.name;

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