import { globalOptions, LogLevel } from '../options';

// tslint:disable:no-console

export function debug(message: string, ...optionalParams: any[]): void {
    if (!shouldLog(LogLevel.Debug))
        return;    
    console.log('[ReduxApp] [DEBUG] ' + message, ...optionalParams);
}

export function debugWarn(message: string, ...optionalParams: any[]): void {
    if (!shouldLog(LogLevel.Debug))
        return;    
    console.warn('[ReduxApp] [DEBUG] ' + message, ...optionalParams);
}

export function verbose(message: string, ...optionalParams: any[]): void {
    if (!shouldLog(LogLevel.Verbose))
        return;
    console.log('[ReduxApp] [VERBOSE] ' + message, ...optionalParams);
}

function shouldLog(level: LogLevel): boolean {
    if (globalOptions.logLevel === LogLevel.None)
        return false;
    if (globalOptions.logLevel > level)
        return false;

    return true;
}