
// tslint:disable:whitespace

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

export class ReduxClassicOptions {
    /**
     * Default value: LogLevel.Warn
     */
    public logLevel = LogLevel.Warn;
    /**
     * Customize actions naming.
     */
    public actionNameResolver: (className: string, methodName: string) => string;
}