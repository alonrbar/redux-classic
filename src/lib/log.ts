import { ReduxApp } from "./reduxApp";
import { LogLevel } from "./globalOptions";

// tslint:disable:no-console

export function debug(message: string, ...optionalParams: any[]): void {
    if (!shouldLog(LogLevel.Debug))
        return;    
    console.log('[ReduxApp] [DEBUG] ' + message, ...optionalParams);
}

export function verbose(message: string, ...optionalParams: any[]): void {
    if (!shouldLog(LogLevel.Verbose))
        return;
    console.log('[ReduxApp] [VERBOSE] ' + message, ...optionalParams);
}

function shouldLog(level: LogLevel): boolean {
    if (ReduxApp.options.logLevel === LogLevel.None)
        return false;
    if (ReduxApp.options.logLevel > level)
        return false;

    return true;
}