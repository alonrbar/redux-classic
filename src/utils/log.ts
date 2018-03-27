import { globalOptions, LogLevel } from '../options';

// tslint:disable:no-console

class Log {

    public verbose(message: string, ...optionalParams: any[]): void {
        if (!this.shouldLog(LogLevel.Verbose))
            return;
        console.debug('VERBOSE [redux-classic] ' + message, ...optionalParams);
    }

    public debug(message: string, ...optionalParams: any[]): void {
        if (!this.shouldLog(LogLevel.Debug))
            return;
        console.log('DEBUG [redux-classic] ' + message, ...optionalParams);
    }

    public warn(message: string, ...optionalParams: any[]): void {
        if (!this.shouldLog(LogLevel.Warn))
            return;
        console.warn('WARN [redux-classic] ' + message, ...optionalParams);
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