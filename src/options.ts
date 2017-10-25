var snakecase = require('lodash.snakecase');

//
// schema options
//

export class SchemaOptions {
    /**
     * Add the class name of the object that holds the action to the action name.
     * Format: <class name>.<action name>
     * Default value: true.
     */
    public actionNamespace? = true;
    /**
     * Use redux style action names. For instance, if a component defines a
     * method called 'incrementCounter' the matching action name will be
     * 'INCREMENT_COUNTER'.
     * Default value: true.
     */
    public uppercaseActions? = true;    
}

export function getActionName(creator: object, methodName: string, options: SchemaOptions): string {
    var actionName = methodName;
    var actionNamespace = creator.constructor.name;

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
// global options
//

export enum LogLevel {
    /**
     * Emit no logs
     */
    None = 0,
    Verbose = 1,    
    Debug = 2,
    Warn = 5,
    /**
     * Emit no logs (same as None)
     */
    Silent = 10
}

export class GlobalOptions {
    public logLevel = LogLevel.Silent;
    /**
     * By default each component is assigned (with some optimizations) with it's
     * relevant sub state on each store change. Set this to false to disable
     * this updating process. The store's state will still be updated as usual
     * and can always be retrieved using store.getState().
     * Default value: true.
     */
    public updateState? = true;
    /**
     * Global defaults.
     * Options supplied explicitly via the decorator will override options specified here.
     */
    public schema = new SchemaOptions();
}

export const globalOptions = new GlobalOptions();