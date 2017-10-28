var context = (require as any).context('./tests', true, /\.(ts|js)$/);
context.keys().forEach(context);
module.exports = context;