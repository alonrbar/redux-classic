import { Store, StoreEnhancer } from 'redux';

export declare function component(ctor: Function): any;
export declare function component(options: SchemaOptions): any;

export declare class ReduxApp<T> {
    
    /**
     * Global redux-app options.
     */
    static options: GlobalOptions;
    
    /**
     * The root component of the application.
     */
    readonly root: T;
    /**
     * The underlying redux store.
     */
    readonly store: Store<T>;
    
    constructor(appSchema: T, enhancer?: StoreEnhancer<T>);
    constructor(appSchema: T, preloadedState: T, enhancer?: StoreEnhancer<T>);
}

export class SchemaOptions {
    /**
     * Add the class name of the object that holds the action to the action name.
     * Format: <class name>.<action name>
     */
    public actionNamespace?: boolean;
    /**
     * Use redux style action names. For instance, if a componentSchema defines a
     * method called 'incrementCounter' the matching action name will be
     * 'INCREMENT_COUNTER'.
     */
    public uppercaseActions?: boolean;
    /**
     * By default each component is assigned (with some optimizations) with it's
     * relevant sub state on each store change. Set this to false to disable
     * this updating process. The store's state will still be updated as usual
     * and can always be retrieved using store.getState().
     */
    public updateState?: boolean;
}

export enum LogLevel {
    /**
     * Emit no logs
     */
    None = 0,
    Verbose = 1,    
    Debug = 2,
    /**
     * Emit no logs (same as None)
     */
    Silent = 10
}

export declare class GlobalOptions {
    logLevel: LogLevel;
    schema: SchemaOptions;
}