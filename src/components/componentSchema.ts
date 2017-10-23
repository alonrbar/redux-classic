import { Dispatch, Store } from 'redux';
import { getActionName, SchemaOptions } from '../options';
import { COMPONENT_ID, COMPONENT_SCHEMA, COMPONENT_SCHEMA_CLASS, COMPONENT_SCHEMA_OPTIONS, getSymbol, NO_DISPATCH, setSymbol } from '../symbols';
import { getConstructorProp, getMethods, log } from '../utils';
import { Component } from './component';

// tslint:disable:ban-types

//
// public
//

/**
 * Class decorator.
 */
export function component(ctor: Function): any;
export function component(options: SchemaOptions): any; // tslint:disable-line:unified-signatures
export function component(ctorOrOptions: Function | SchemaOptions): any {
    if (typeof ctorOrOptions === 'function') {
        componentSchemaDecorator.call(undefined, ctorOrOptions);
    } else {
        return (ctor: Function) => componentSchemaDecorator(ctor, ctorOrOptions);
    }
}

export function isComponentSchema(obj: object): boolean {
    return getConstructorProp(obj, COMPONENT_SCHEMA);
}

/**
 * Throws if 'obj' is not a componentSchema.
 */
export function assertComponentSchema(obj: object, msg?: string): void {
    if (!isComponentSchema(obj))
        throw new Error(msg || `Invalid argument. ${nameof(component)} expected.`);
}

export function getComponentClass(schema: object, dispatch: Dispatch<object>): typeof Component {
    var type = getSymbol(schema, COMPONENT_SCHEMA_CLASS);
    if (!type) {
        type = createComponentClass(schema, dispatch);
    }
    return type;  
}

//
// private
//

function componentSchemaDecorator(ctor: Function, options?: SchemaOptions) {
    setSymbol(ctor, COMPONENT_SCHEMA, true);
    setSymbol(ctor, COMPONENT_SCHEMA_OPTIONS, options);
}

function createComponentClass<T extends object>(schema: object, dispatch: Dispatch<object>) {
    
    // declare new class
    class ComponentClass extends Component<T> {
        constructor(store: Store<T>, schemaArg: T, ...params: any[]) {
            super(store, schemaArg, ...params);
        }
    }
    
    // patch it's prototype
    const actions = createActions(schema, dispatch);
    Object.assign(ComponentClass.prototype, actions);

    // cache the result on the prototype of the schema
    const proto = Object.getPrototypeOf(schema);
    return setSymbol(proto, COMPONENT_SCHEMA_CLASS, ComponentClass);
}

function createActions(schema: object, dispatch: Dispatch<object>): any {

    const methods = getMethods(schema);
    if (!methods)
        return undefined;

    const componentActions: any = {};
    Object.keys(methods).forEach(key => {
        componentActions[key] = function (this: Component<object>, ...payload: any[]): void {

            // verify 'this' arg
            if (!(this instanceof Component)) {
                const msg = "Component method invoked with non-Component as 'this'. " +
                    "Some redux-app features such as the withId decorator will not work. Bound 'this' argument is: ";
                log.warn(msg, this);
            }

            const oldMethod = methods[key];
            if (getSymbol(oldMethod, NO_DISPATCH)) {

                // handle non-dispatch methods (just call the function)
                oldMethod.call(this, ...payload);
            } else {

                // handle dispatch methods (use store dispatch)
                dispatch({
                    type: getActionName(key, schema),
                    id: getSymbol(this, COMPONENT_ID),
                    payload: payload
                });
            }
        };
    });

    return componentActions;    
}