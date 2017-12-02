
//
// schema options
//

export class SchemaOptions {
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
    public uppercaseActions? = true;
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
     * When set to 'true' every component will have an additional __originalClassName__ property.
     * Can be useful for debugging.
     * Default value: false.
     */
    public emitClassNames = false;
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
    public convertToPlainObject? = true;    
    /**
     * Global defaults.
     * Options supplied explicitly via the decorator will override options specified here.
     */
    public schema = new SchemaOptions();
}

export const globalOptions = new GlobalOptions();