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
    /**
     * Inherit methods from base component classes.
     * Default value: true.
     */
    public inheritMethods?= true;
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
    Error = 6,
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
     * When set to 'true' every component will have an additional __originalClassName__ property.
     * Can be useful for debugging.
     * Default value: false.
     */
    public emitClassNames = false;
    /**
     * From the original redux FAQ: 
     * ----------------------------
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
     * The case in redux-app:
     * ----------------------
     * 
     * By default redux-app aligns with redux recommendations and treats
     * everything stored in the store state as a plain object to prevent the
     * previously described issues. This approach may come with some performance
     * cost. Therefor if you don't care about time travel debugging or
     * rehydration of the store content etc. and you don't want to pay the
     * performance cost you can set this option to false. 
     * 
     * Do note however that redux-app enables you to have class instances
     * initially set as part of your application tree. This means that every
     * instance that was part of your initial redux-app application tree will
     * stay a class instance and will keep it's methods even after the state is
     * changed. This way you can enjoy the good in both worlds - having time
     * travel debugging and other advanced redux features working while still
     * invoking methods from your application tree.
     * 
     * Default value: true.
     */
    public convertToPlainObject? = true;    
    /**
     * Global defaults.
     * Options supplied explicitly via the decorator will override options specified here.
     */
    public schema = new SchemaOptions();
}

export const globalOptions = new GlobalOptions();