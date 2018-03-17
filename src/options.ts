
// tslint:disable:whitespace

//
// action options
//

export class ActionOptions {
    /**
     * Add the class name of the object that holds the action to the action name.
     * Format: <class name><separator><action name>
     * Default value: true.
     */
    public actionNamespace? = true;
    /**
     * Default value: . (dot)
     */
    public actionNamespaceSeparator? = '.';
    /**
     * Use redux style action names. For instance, if a component defines a
     * method called 'incrementCounter' the matching action name will be
     * 'INCREMENT_COUNTER'.
     * Default value: true.
     */
    public uppercaseActions? = false;
}

//
// app options
//

export class AppOptions {
    /**
     * Name of the newly created app.     
     */
    public name?: string;
    /**
     * By default each component is assigned (with some optimizations) with it's
     * relevant sub state on each store change. Set this to false to disable
     * this updating process. The store's state will still be updated as usual
     * and can always be retrieved using store.getState().
     * Default value: true.
     */
    public updateState? = true;    
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
    /**
     * Default value: LogLevel.Warn
     */
    public logLevel = LogLevel.Warn;
    /**
     * Customize actions naming.
     */
    public action = new ActionOptions();
}

export const globalOptions = new GlobalOptions();