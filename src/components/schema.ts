import { Dispatch, Store } from 'redux';
import { getActionName } from '../options';
import { COMPONENT_ID, COMPONENT_SCHEMA, COMPONENT_SCHEMA_CLASS, getSymbol, NO_DISPATCH, setSymbol } from '../symbols';
import { getConstructorProp, getMethods, log } from '../utils';
import { Component } from './component';

//
// Terminology Explained:
// 
// In redux-app internal terminology a 'component schema' is an instance of a
// class that is decorated with the @component decorator.
//

export class Schema {

    //
    // public
    //

    public static isComponentSchema(obj: object): boolean {
        return getConstructorProp(obj, COMPONENT_SCHEMA);
    }

    /**
     * Throws if 'obj' is not a componentSchema.
     */
    public static assertComponentSchema(obj: object, msg?: string): void {
        if (!Schema.isComponentSchema(obj))
            throw new Error(msg || `Invalid argument. Decorated component expected.`);
    }

    public static getComponentClass(schema: object, dispatch: Dispatch<object>): typeof Component {
        var type = getSymbol(schema, COMPONENT_SCHEMA_CLASS);
        if (!type) {
            type = Schema.createComponentClass(schema, dispatch);
        }
        return type;
    }

    //
    // private
    //

    private static createComponentClass<T extends object>(schema: object, dispatch: Dispatch<object>) {

        // declare new class
        class ComponentClass extends Component<T> {
            constructor(store: Store<T>, schemaArg: T, ...params: any[]) {
                super(store, schemaArg, ...params);
            }
        }

        // patch it's prototype
        const actions = Schema.createActions(schema, dispatch);
        Object.assign(ComponentClass.prototype, actions);

        // cache the result on the prototype of the schema
        const proto = Object.getPrototypeOf(schema);
        return setSymbol(proto, COMPONENT_SCHEMA_CLASS, ComponentClass);
    }

    private static createActions(schema: object, dispatch: Dispatch<object>): any {

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
}