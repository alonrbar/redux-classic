import { globalOptions, LogLevel } from '../options';

// tslint:disable:no-console

class Log {

    public verbose(message: string, ...optionalParams: any[]): void {
        if (!this.shouldLog(LogLevel.Verbose))
            return;
        console.debug('VERBOSE [redux-app] ' + message, ...optionalParams);
    }

    public debug(message: string, ...optionalParams: any[]): void {
        if (!this.shouldLog(LogLevel.Debug))
            return;
        console.log('DEBUG [redux-app] ' + message, ...optionalParams);
    }

    public warn(message: string, ...optionalParams: any[]): void {
        if (!this.shouldLog(LogLevel.Warn))
            return;
        console.warn('WARN [redux-app] ' + message, ...optionalParams);
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