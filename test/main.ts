import { LogLevel, ReduxApp } from 'src';
ReduxApp.options.logLevel = LogLevel.Silent;

var context = (require as any).context('./tests', true, /\.(ts|js)$/);
context.keys().forEach(context);
module.exports = context;