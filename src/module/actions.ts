import { Action } from 'redux';
import { ModuleInfo, ModuleTemplateInfo } from '../info';
import { ActionOptions, globalOptions } from '../options';
import { IMap, Method } from '../types';
import { getMethods } from '../utils';
import { Module } from './module';
var snakecase = require('lodash.snakecase');

// tslint:disable-next-line:interface-name
export interface ReduxClassicAction extends Action {
    id: any;
    payload: any[];
}

export class ModuleActions {

    public static createActions(template: object): IMap<Method> {
        const methods = getMethods(template);
        if (!methods)
            return undefined;

        const templateInfo = ModuleTemplateInfo.getInfo(template);
        const actions: any = {};
        Object.keys(methods).forEach(key => {
            actions[key] = function (this: Module, ...payload: any[]): void {

                // verify 'this' arg
                if (!(this instanceof Module))
                    throw new Error(
                        `Module method invoked with non-module as 'this'. ` +
                        `Module: ${template.constructor.name}, ` + 
                        `Method: ${key}, ` +
                        `Bound 'this' argument is: ${this}.`
                    );

                const oldMethod = methods[key];

                // handle actions and sequences (use store dispatch)
                if (templateInfo.actions[key] || templateInfo.sequences[key]) {
                    const moduleInfo = ModuleInfo.getInfo(this);
                    const action: ReduxClassicAction = {
                        type: ModuleActions.getActionName(template, key),
                        id: (moduleInfo ? moduleInfo.id : undefined),
                        payload: payload
                    };
                    moduleInfo.dispatch(action);
                }

                // handle regular methods (just call the function)
                if (!templateInfo.actions[key]) {
                    return oldMethod.call(this, ...payload);
                }
            };
        });

        return actions;
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