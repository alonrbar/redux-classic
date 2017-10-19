import { SchemaOptions } from "./schemaOptions";

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

export class GlobalOptions {
    public logLevel = LogLevel.Silent;
    public schema = new SchemaOptions();
}