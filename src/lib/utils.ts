export function getArgumentNames(func: Function): string[] {

    // original regex from require.js
    var FN_ARGS = /^function\s*?[^\(]*?\(\s*?([^\)]*?)\)/m;
    var CLASS_CTOR_ARGS = /^class[\s\S]*?constructor\s*?[^\(]*?\(\s*?([^\)]*?)\)/m;

    var functionArgsRegex = func.toString().match(FN_ARGS);
    var classArgsRegex = func.toString().match(CLASS_CTOR_ARGS);

    var args;
    if (classArgsRegex && classArgsRegex.length) {
        // Function declared as es5 class
        args = classArgsRegex[1];
    } else if (functionArgsRegex && functionArgsRegex.length) {
        // Function declared as standard function
        args = functionArgsRegex[1];
    } else {
        // Get here if:
        // 1. It's a class declaration but no constructor was specified
        // 2. Unknown parse error... Should improve the regex...
        return [];
    }

    args = args.split(',')
        .map(str => str.trim())
        .filter(arg => arg !== "");

    return args;
}

export function getPrototype(obj: any) {
    if (!obj)
        return undefined;
    if (obj.prototype)
        return obj.prototype;
    if (obj.constructor.prototype)
        return obj.constructor.prototype;
}

export function getMethods(obj: any): { [name: string]: Function } {
    if (!obj)
        return undefined;

    var proto = getPrototype(obj);
    if (!proto)
        return undefined;

    var methods: any = {};
    for (let key of Object.keys(proto)) {
        if (typeof proto[key] === 'function')
            methods[key] = proto[key];
    }

    return methods;
} 