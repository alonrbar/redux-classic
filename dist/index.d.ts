import { Store, StoreEnhancer } from 'redux';

//
// Decorators
//

/**
 * Method decorator.
 * 
 * Mark this method as a Redux action.
 */
export function action(target: object, propertyKey: string | symbol): void;

/**
 * Property decorator.
 * 
 * Computed values are computed each time the store state is changed.
 */
export function computed(target: any, propertyKey: string | symbol): void;

/**
 * Property decorator.
 * Instruct redux-app to not store this property in the store.
 */
export function ignoreState(target: object, propertyKey: string | symbol): void;

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
     * @param type The type of the component.
     * @param componentId The ID of the component (assuming the ID was assigned
     * to the component by the 'withId' decorator). If not specified will get to
     * the first available component of that type.
     * @param appId The name of the ReduxApp instance to search in. If not
     * specified will search in default app.
     */
    static getComponent<T>(type: Constructor<T>, componentId?: string, appId?: string): T;

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

/**
 * @param obj 
 * @param bind Whether or not to bind the returned methods to 'obj'. Default
 * value: false.
 */
export function getMethods(obj: object | Function, bind?: boolean): IMap<Method>;

//
// types
//
  
export type Method = Function;
  
export interface Constructor<T> {
    new(...args: any[]): T;
}

export interface IMap<T> { 
    [key: string]: T;
}

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
     * Default value: false.
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