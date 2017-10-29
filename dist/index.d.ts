import { Store, StoreEnhancer } from 'redux';

//
// Decorators
//

/**
 * Class decorator.
 */
export function component(ctor: Function): any;
export function component(options: SchemaOptions): any;

/**
 * Property decorator.
 * 
 * Computed values are computed each time the store state is changed.
 */
export function computed(target: any, propertyKey: string | symbol): void;

export class ConnectOptions {
    /**
     * The name of the ReduxApp instance to connect to.
     * If not specified will connect to default app.
     */
    app?: string;
    /**
     * The ID of the target component (assuming the ID was assigned to the
     * component by the 'withId' decorator).
     * If not specified will connect to the first available component of that type.
     */
    id?: any;
    /**
     * The 'connect' decorator uses a getter to connect to the it's target. By
     * default the the getter is replaced with a standard value once the first
     * non-empty value is retrieved. Set this value to false to leave the getter
     * in place.
     * Defatul value: false
     */
    live?: boolean;
}

/**
 * Property decorator. 
 * 
 * Connects the property to a component in the specified (or default) app.
 * 
 * Usage Note: 
 * 
 * Connected properties can be thought of as pointers to other components. If
 * the connected property has an initial value assigned, it will be overridden
 * once the component is connected. One consequence of this fact is that there
 * must be at least one source component, i.e. there must be at least one
 * component of that type that has a value and is not decorated with the
 * 'connect' decorator.
 */
export function connect(options?: ConnectOptions): PropertyDecorator;
export function connect(target: any, propertyKey: string | symbol): void;

/**
 * Method decorator.
 * 
 * Instruct redux-app to keep this method as is and not to replace it with invocation of store.dispatch.
 * Alias of 'sequence'.
 */
export function noDispatch(target: any, propertyKey: string | symbol): void;
/**
 * Method decorator.
 * 
 * Instruct redux-app to keep this method as is and not to replace it with invocation of store.dispatch.
 * Alias of 'noDispatch'.
 */
export function sequence(target: any, propertyKey: string | symbol): void;

/**
 * Property decorator.
 */
export function withId(target: object, propertyKey: string | symbol): void;
export function withId(id?: any): PropertyDecorator;


//
// ReduxApp
//

export class ReduxApp<T extends object> {
    
    /**
     * Global redux-app options.
     */
    static options: GlobalOptions;

    static createApp<T extends object>(appCreator: T, enhancer?: StoreEnhancer<T>): ReduxApp<T>;
    static createApp<T extends object>(appCreator: T, options: AppOptions, enhancer?: StoreEnhancer<T>): ReduxApp<T>;
    static createApp<T extends object>(appCreator: T, options: AppOptions, preloadedState: any, enhancer?: StoreEnhancer<T>): ReduxApp<T>;
    
    readonly name: string;
    /**
     * The root component of the application.
     */
    readonly root: T;
    /**
     * The underlying redux store.
     */
    readonly store: Store<T>;
    
    constructor(appCreator: T, enhancer?: StoreEnhancer<T>);
    constructor(appCreator: T, options: AppOptions, enhancer?: StoreEnhancer<T>);
    constructor(appCreator: T, options: AppOptions, preloadedState: any, enhancer?: StoreEnhancer<T>);

    dispose(): void;
}

//
// Utilities
//

export function isInstanceOf(obj: any, type: Function): boolean;

//
// Options
//

export class SchemaOptions {
    /**
     * Add the class name of the object that holds the action to the action name.
     * Format: <class name>.<action name>
     * Default value: true.
     */
    actionNamespace?: boolean;
    /**
     * Use redux style action names. For instance, if a component defines a
     * method called 'incrementCounter' the matching action name will be
     * 'INCREMENT_COUNTER'.
     * Default value: true.
     */
    uppercaseActions?: boolean;
}

export class AppOptions {
    /**
     * Name of the newly created app.
     */
    name?: string;
    /**
     * By default each component is assigned (with some optimizations) with it's
     * relevant sub state on each store change. Set this to false to disable
     * this updating process. The store's state will still be updated as usual
     * and can always be retrieved using store.getState().
     * Default value: true.
     */
    updateState?: boolean;
}

export class GlobalOptions {
    /**
     * Default value: LogLevel.Warn
     */
    logLevel: LogLevel;
    /**
     * When set to 'true' every component will have an additional __originalClassName__ property.
     * May be useful for debugging.
     * Default value: false.
     */
    emitClassNames: boolean;
    /**
     * Global defaults.
     * Options supplied explicitly via the decorator will override options specified here.
     */
    schema: SchemaOptions;
}

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