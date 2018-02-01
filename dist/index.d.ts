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
     * default the getter is replaced with a standard value (reference) once the
     * first non-empty value is retrieved. Set this value to true to leave the
     * getter in place.
     * Default value: false
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
 * Property decorator.
 * Instruct redux-app to not store this property in the store.
 */
export function ignoreState(target: object, propertyKey: string | symbol): void;

/**
 * Method decorator.
 * 
 * Instruct redux-app to keep this method as is and not to replace it with invocation of store.dispatch.
 */
export function noDispatch(target: any, propertyKey: string | symbol): void;

/**
 * Method decorator. 
 * 
 * The method will dispatch an action with the corresponding name but the
 * dispatched action will **not** trigger a reducer reaction. Instead, after the
 * dispatch process is done the method will be invoked as a regular one
 * (similarly to `noDispatch` methods).
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

    /**
     * Get an existing ReduxApp instance.
     * 
     * @param appId The name of the ReduxApp instance to retrieve. If not
     * specified will return the default app.
     */
    static getApp<T extends object = any>(appId?: string): ReduxApp<T>;

    /**
     * @param type The type of the component.
     * @param componentId The ID of the component (assuming the ID was assigned
     * to the component by the 'withId' decorator). If not specified will get to
     * the first available component of that type.
     * @param appId The name of the ReduxApp instance to search in. If not
     * specified will search in default app.
     */
    static getComponent<T extends Function>(type: T, componentId?: string, appId?: string): T;

    /**
     * Whether or not the component was changed as a result of the last
     * dispatched action.
     * @param comp The component to check.
     * @param appId The name of the ReduxApp instance to check against. If not
     * specified will check against default app.
     */
    static wasComponentChanged(comp: any, appId?: string): boolean;

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
     * Format: <class name><separator><action name>
     * Default value: true.
     */
    actionNamespace?: boolean;
    /**
     * Default value: . (dot)
     */
    actionNamespaceSeparator?: string;
    /**
     * Use redux style action names. For instance, if a component defines a
     * method called 'incrementCounter' the matching action name will be
     * 'INCREMENT_COUNTER'.
     * Default value: true.
     */
    uppercaseActions?: boolean;
}

export class ComputedOptions {
    /**
     * Whether to perform deep comparison or a simple equality comparison
     * before updating computed values. Using deep comparison has a small
     * additional performance cost.
     * Default value: true.
     */
    deepComparison: boolean;
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
     * #### From the original redux FAQ: 
     * 
     * Q: Can I put functions, promises, or other non-serializable items in my
     * store state? 
     * 
     * A: It is highly recommended that you only put plain serializable objects,
     * arrays, and primitives into your store. It's technically possible to
     * insert non-serializable items into the store, but doing so can break the
     * ability to persist and rehydrate the contents of a store, as well as
     * interfere with time-travel debugging.
     *
     * If you are okay with things like persistence and time-travel debugging
     * potentially not working as intended, then you are totally welcome to put
     * non-serializable items into your Redux store. Ultimately, it's your
     * application, and how you implement it is up to you. As with many other
     * things about Redux, just be sure you understand what tradeoffs are
     * involved. 
     * 
     * #### The case in redux-app:
     * 
     * By default redux-app aligns with redux recommendations and treats
     * everything stored in the store state as a plain object to prevent the
     * previously described issues. This approach may come with some performance
     * (and of course usability) cost. Therefor if you don't care about time
     * travel debugging or rehydration of the store content etc. and you don't
     * want to pay the aforementioned cost you can set this option to false.
     * 
     * Default value: true.
     */
    convertToPlainObject?: boolean;
    /**
     * Global defaults.
     * Options supplied explicitly via the decorator will override options specified here.
     */
    schema: SchemaOptions;
    /**
     * Customize `computed` properties behavior.
     */
    computed: ComputedOptions;
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