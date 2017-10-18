import { getArgumentNames } from "./utils";

declare var require: any
var snakecase = require('lodash.snakecase');

//
// public
//

export interface IComponentSchemaOptions {
    actionNamespace?: boolean;
    uppercaseActions?: boolean;
}

export function componentSchema(ctorOrOptions: Function | IComponentSchemaOptions): any {
    if (typeof ctorOrOptions === 'function') {
        componentSchemaDecorator.call(undefined, ctorOrOptions);
    } else {
        return (ctor: Function) => componentSchemaDecorator(ctor, ctorOrOptions);
    }
}

export function isComponentSchema(obj: any): boolean {
    return getConstructorProp(obj, COMPONENT_SCHEMA);
}

export function getSchemaOptions(obj: any): IComponentSchemaOptions {
    if (!isComponentSchema(obj))
        throw new Error(`Invalid argument. ${nameof<IComponentSchemaOptions>()} expected.`)

    return Object.assign({}, defaultSchemaOptions, getConstructorProp(obj, COMPONENT_SCHEMA_OPTIONS));
}

export function getActionName(key: string, schema: any): string {
    var options = getSchemaOptions(schema);

    var actionName = key;
    var actionNamespace = schema.constructor.name;

    if (options.uppercaseActions) {
        actionName = snakecase(actionName).toUpperCase();
        actionNamespace = snakecase(actionNamespace).toUpperCase();
    }

    if (options.actionNamespace) {
        actionName = actionNamespace + '.' + actionName;
    }

    return actionName;
}

//
// private
//

const COMPONENT_SCHEMA = Symbol('COMPONENT_SCHEMA');
const COMPONENT_SCHEMA_OPTIONS = Symbol('COMPONENT_SCHEMA_OPTIONS');

function componentSchemaDecorator(ctor: Function, options?: IComponentSchemaOptions) {
    if (getArgumentNames(ctor).length)
        throw new Error('componentSchema classes must have a parameter-less constructor');

    (ctor as any)[COMPONENT_SCHEMA] = true;
    (ctor as any)[COMPONENT_SCHEMA_OPTIONS] = options;
}

function getConstructorProp(obj: any, key: symbol | string): any {
    return obj && obj.constructor && obj.constructor[key];
}

const defaultSchemaOptions: IComponentSchemaOptions = {
    actionNamespace: true,
    uppercaseActions: true
}