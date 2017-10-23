import { globalOptions, LogLevel } from '../options';

// tslint:disable:no-console

class Log {

    public verbose(message: string, ...optionalParams: any[]): void {
        if (!this.shouldLog(LogLevel.Verbose))
            return;
        console.log('[ReduxApp] [VERBOSE] ' + message, ...optionalParams);
    }

    public debug(message: string, ...optionalParams: any[]): void {
        if (!this.shouldLog(LogLevel.Debug))
            return;
        console.log('[ReduxApp] [DEBUG] ' + message, ...optionalParams);
    }

    public warn(message: string, ...optionalParams: any[]): void {
        if (!this.shouldLog(LogLevel.Warn))
            return;
        console.warn('[ReduxApp] [DEBUG] ' + message, ...optionalParams);
    }    

    private shouldLog(level: LogLevel): boolean {
        if (globalOptions.logLevel === LogLevel.None)
            return false;
        if (globalOptions.logLevel > level)
            return false;

        return true;
    }
}

export const log = new Log();