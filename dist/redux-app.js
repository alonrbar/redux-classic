(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("redux-app", [], factory);
	else if(typeof exports === 'object')
		exports["redux-app"] = factory();
	else
		root["redux-app"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.REDUCER = Symbol('REDUX-APP.COMPONENT.REDUCER');
exports.DISPOSE = Symbol('REDUX-APP.COMPONENT.DISPOSE');
exports.COMPONENT_SCHEMA = Symbol('REDUX-APP.COMPONENT_SCHEMA');
exports.COMPONENT_SCHEMA_OPTIONS = Symbol('REDUX-APP.COMPONENT_SCHEMA.OPTIONS');
exports.WITH_ID = Symbol('REDUX-APP.COMPONENT_SCHEMA.WITH_ID');
exports.AUTO_ID = Symbol('REDUX-APP.COMPONENT_SCHEMA.AUTO_ID');


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var componentSchema_1 = __webpack_require__(2);
var utils_1 = __webpack_require__(3);
var symbols_1 = __webpack_require__(0);
var snakecase = __webpack_require__(6);
var SchemaOptions = (function () {
    function SchemaOptions() {
        this.actionNamespace = true;
        this.uppercaseActions = true;
        this.updateState = true;
    }
    return SchemaOptions;
}());
exports.SchemaOptions = SchemaOptions;
function getSchemaOptions(schema) {
    componentSchema_1.assertComponentSchema(schema);
    return Object.assign({}, new SchemaOptions(), exports.globalOptions.schema, utils_1.getConstructorProp(schema, symbols_1.COMPONENT_SCHEMA_OPTIONS));
}
exports.getSchemaOptions = getSchemaOptions;
function getActionName(key, schema) {
    var options = getSchemaOptions(schema);
    var actionName = key;
    var actionNamespace = schema.constructor.name;
    if (options.uppercaseActions) {
        actionName = snakecase(actionName).toUpperCase();
        actionNamespace = snakecase(actionNamespace).toUpperCase();
    }
    if (options.actionNamespace) {
        actionName = actionNamespace + '.' + actionName;
    }
    return actionName;
}
exports.getActionName = getActionName;
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["None"] = 0] = "None";
    LogLevel[LogLevel["Verbose"] = 1] = "Verbose";
    LogLevel[LogLevel["Debug"] = 2] = "Debug";
    LogLevel[LogLevel["Silent"] = 10] = "Silent";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var GlobalOptions = (function () {
    function GlobalOptions() {
        this.logLevel = LogLevel.Silent;
        this.schema = new SchemaOptions();
    }
    return GlobalOptions;
}());
exports.GlobalOptions = GlobalOptions;
exports.globalOptions = new GlobalOptions();


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(3);
var symbols_1 = __webpack_require__(0);
function component(ctorOrOptions) {
    if (typeof ctorOrOptions === 'function') {
        componentSchemaDecorator.call(undefined, ctorOrOptions);
    }
    else {
        return function (ctor) { return componentSchemaDecorator(ctor, ctorOrOptions); };
    }
}
exports.component = component;
function isComponentSchema(obj) {
    return utils_1.getConstructorProp(obj, symbols_1.COMPONENT_SCHEMA);
}
exports.isComponentSchema = isComponentSchema;
function assertComponentSchema(obj, msg) {
    if (!isComponentSchema(obj))
        throw new Error(msg || "Invalid argument. " + "component" + " expected.");
}
exports.assertComponentSchema = assertComponentSchema;
function componentSchemaDecorator(ctor, options) {
    if (utils_1.getArgumentNames(ctor).length)
        throw new Error('componentSchema classes must have a parameter-less constructor');
    ctor[symbols_1.COMPONENT_SCHEMA] = true;
    ctor[symbols_1.COMPONENT_SCHEMA_OPTIONS] = options;
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getArgumentNames(func) {
    var FN_ARGS = /^function\s*?[^\(]*?\(\s*?([^\)]*?)\)/m;
    var CLASS_CTOR_ARGS = /^class[\s\S]*?constructor\s*?[^\(]*?\(\s*?([^\)]*?)\)/m;
    var functionArgsRegex = func.toString().match(FN_ARGS);
    var classArgsRegex = func.toString().match(CLASS_CTOR_ARGS);
    var args;
    if (classArgsRegex && classArgsRegex.length) {
        args = classArgsRegex[1];
    }
    else if (functionArgsRegex && functionArgsRegex.length) {
        args = functionArgsRegex[1];
    }
    else {
        return [];
    }
    args = args.split(',')
        .map(function (str) { return str.trim(); })
        .filter(function (arg) { return arg !== ""; });
    return args;
}
exports.getArgumentNames = getArgumentNames;
function getPrototype(obj) {
    if (!obj)
        return undefined;
    return obj.prototype || obj.constructor.prototype;
}
exports.getPrototype = getPrototype;
function getMethods(obj) {
    if (!obj)
        return undefined;
    var proto = getPrototype(obj);
    if (!proto)
        return undefined;
    var methods = {};
    for (var _i = 0, _a = Object.keys(proto); _i < _a.length; _i++) {
        var key = _a[_i];
        if (typeof proto[key] === 'function')
            methods[key] = proto[key];
    }
    return methods;
}
exports.getMethods = getMethods;
function getProp(obj, path) {
    if (typeof path === 'string') {
        path = path.replace(/\[|\]/g, '.').split('.').filter(function (token) { return typeof token === 'string' && token.trim() !== ''; });
    }
    return path.reduce(function (result, key) {
        if (typeof result === 'object' && key) {
            return result[key.toString()];
        }
        return undefined;
    }, obj);
}
exports.getProp = getProp;
function getConstructorProp(obj, key) {
    return obj && obj.constructor && obj.constructor[key];
}
exports.getConstructorProp = getConstructorProp;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var componentSchema_1 = __webpack_require__(2);
exports.component = componentSchema_1.component;
var options_1 = __webpack_require__(1);
exports.SchemaOptions = options_1.SchemaOptions;
exports.GlobalOptions = options_1.GlobalOptions;
exports.LogLevel = options_1.LogLevel;
var reduxApp_1 = __webpack_require__(7);
exports.ReduxApp = reduxApp_1.ReduxApp;
var withId_1 = __webpack_require__(12);
exports.withId = withId_1.withId;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("lodash.snakecase");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = __webpack_require__(8);
var component_1 = __webpack_require__(9);
var options_1 = __webpack_require__(1);
var reducers_1 = __webpack_require__(11);
var symbols_1 = __webpack_require__(0);
var ReduxApp = (function () {
    function ReduxApp(appSchema) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var dummyReducer = function () { };
        this.store = redux_1.createStore.apply(void 0, [dummyReducer].concat(params));
        var rootComponent = new component_1.Component(this.store, appSchema, null, []);
        this.root = rootComponent;
        var actualReducer = this.getReducer(rootComponent);
        this.store.replaceReducer(actualReducer);
    }
    ReduxApp.prototype.getReducer = function (component) {
        var rootReducer = component[symbols_1.REDUCER];
        var subReducers = {};
        for (var _i = 0, _a = Object.keys(component); _i < _a.length; _i++) {
            var key = _a[_i];
            if (component[key] instanceof component_1.Component) {
                subReducers[key] = this.getReducer(component[key]);
            }
        }
        if (Object.keys(subReducers).length) {
            var combinedSubReducer = reducers_1.simpleCombineReducers(subReducers);
            return function (state, action) {
                var thisState = rootReducer(state, action);
                var subStates = combinedSubReducer(state, action);
                return __assign({}, thisState, subStates);
            };
        }
        return rootReducer;
    };
    ReduxApp.options = options_1.globalOptions;
    return ReduxApp;
}());
exports.ReduxApp = ReduxApp;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var componentSchema_1 = __webpack_require__(2);
var log_1 = __webpack_require__(10);
var options_1 = __webpack_require__(1);
var utils_1 = __webpack_require__(3);
var symbols_1 = __webpack_require__(0);
var Component = (function () {
    function Component(store, schema, parent, path) {
        if (!componentSchema_1.isComponentSchema(schema))
            throw new Error("Argument '" + "schema" + "' is not a component schema. Did you forget to use the decorator?");
        this[symbols_1.DISPOSE] = [];
        createSelf(this, store, schema, parent, path);
        createSubComponents(this, store, schema, path);
        log_1.debug("[Component] new " + schema.constructor.name + " component created. path: root." + path.join('.'));
    }
    Component.prototype.disposeComponent = function () {
        var disposables = this[symbols_1.DISPOSE];
        while (disposables.length) {
            var disposable = disposables.pop();
            if (disposable && disposable.dispose)
                disposable.dispose();
        }
    };
    return Component;
}());
exports.Component = Component;
function createSelf(component, store, schema, parent, path) {
    for (var _i = 0, _a = Object.keys(schema); _i < _a.length; _i++) {
        var key = _a[_i];
        component[key] = schema[key];
    }
    var actionInvokers = createActions(store.dispatch, schema, parent, path);
    Object.assign(component, actionInvokers);
    component[symbols_1.REDUCER] = createReducer(schema, parent, path);
    var options = options_1.getSchemaOptions(schema);
    if (options.updateState) {
        var unsubscribe_1 = store.subscribe(function () { return updateState(component, store.getState(), path); });
        component[symbols_1.DISPOSE].push({ dispose: function () { return unsubscribe_1(); } });
    }
}
function createSubComponents(component, store, schema, path) {
    for (var _i = 0, _a = Object.keys(schema); _i < _a.length; _i++) {
        var key = _a[_i];
        var subSchema = schema[key];
        if (componentSchema_1.isComponentSchema(subSchema)) {
            component[key] = new Component(store, subSchema, schema, path.concat([key]));
        }
    }
}
function createActions(dispatch, schema, parent, path) {
    var methods = utils_1.getMethods(schema);
    if (!methods)
        return undefined;
    var componentId = getComponentId(parent, path);
    var actionInvokers = {};
    Object.keys(methods).forEach(function (key) {
        actionInvokers[key] = function () {
            var payload = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                payload[_i] = arguments[_i];
            }
            dispatch({
                type: options_1.getActionName(key, schema),
                id: componentId,
                payload: payload
            });
        };
    });
    return actionInvokers;
}
function createReducer(schema, parent, path) {
    var componentId = getComponentId(parent, path);
    var methods = utils_1.getMethods(schema);
    var methodNames = {};
    Object.keys(methods).forEach(function (methName) {
        var actionName = options_1.getActionName(methName, schema);
        methodNames[actionName] = methName;
    });
    return function (state, action) {
        log_1.verbose("[reducer] reducer of: " + schema.constructor.name + ", action: " + action.type);
        if (state === undefined) {
            log_1.verbose('[reducer] state is undefined, returning initial value');
            return schema;
        }
        if (componentId !== action.id) {
            log_1.verbose("[reducer] component id and action.id don't match (" + componentId + " !== " + action.id + ")");
            return state;
        }
        var methodName = methodNames[action.type];
        var actionReducer = methods[methodName];
        if (!actionReducer) {
            log_1.verbose('[reducer] no matching action in this reducer, returning previous state');
            return state;
        }
        var newState = Object.assign({}, state);
        actionReducer.call.apply(actionReducer, [newState].concat(action.payload));
        log_1.verbose('[reducer] reducer invoked returning new state');
        return newState;
    };
}
function updateState(component, newGlobalState, path) {
    log_1.verbose('[updateState] updating component in path: ', path.join('.'));
    var self = component;
    var newScopedState = utils_1.getProp(newGlobalState, path);
    var propsDeleted = [];
    var propsAssigned = [];
    log_1.verbose('[updateState] store before: ', newScopedState);
    log_1.verbose('[updateState] component before: ', component);
    Object.keys(newScopedState).forEach(function (key) {
        if (self[key] !== newScopedState[key] && !(self[key] instanceof Component)) {
            self[key] = newScopedState[key];
            propsAssigned.push(key);
        }
    });
    Object.keys(component).forEach(function (key) {
        if (newScopedState[key] === undefined) {
            delete self[key];
            propsDeleted.push(key);
        }
    });
    if (propsDeleted.length || propsAssigned.length) {
        log_1.verbose('[updateState] store after: ', newScopedState);
        log_1.verbose('[updateState] component after: ', component);
        log_1.debug("[updateState] state of " + path.join('.') + " changed");
        if (propsDeleted.length) {
            log_1.debug('[updateState] props deleted: ', propsDeleted);
        }
        else {
            log_1.verbose('[updateState] props deleted: ', propsDeleted);
        }
        if (propsAssigned.length) {
            log_1.debug('[updateState] props assigned: ', propsAssigned);
        }
        else {
            log_1.verbose('[updateState] props assigned: ', propsAssigned);
        }
    }
    else {
        log_1.verbose('[updateState] no change');
    }
}
var autoComponentId = 0;
function getComponentId(parent, path) {
    if (!parent || !path.length)
        return undefined;
    var idLookup = parent[symbols_1.WITH_ID];
    if (!idLookup)
        return undefined;
    var selfKey = path[path.length - 1];
    var id = parent[symbols_1.WITH_ID][selfKey];
    if (!id)
        return undefined;
    if (id === symbols_1.AUTO_ID) {
        var generatedId = --autoComponentId;
        log_1.verbose('[getComponentId] new component id generated: ' + generatedId);
        parent[symbols_1.WITH_ID][selfKey] = generatedId;
        return generatedId;
    }
    return id;
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var options_1 = __webpack_require__(1);
function debug(message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    if (!shouldLog(options_1.LogLevel.Debug))
        return;
    console.log.apply(console, ['[ReduxApp] [DEBUG] ' + message].concat(optionalParams));
}
exports.debug = debug;
function verbose(message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    if (!shouldLog(options_1.LogLevel.Verbose))
        return;
    console.log.apply(console, ['[ReduxApp] [VERBOSE] ' + message].concat(optionalParams));
}
exports.verbose = verbose;
function shouldLog(level) {
    if (options_1.globalOptions.logLevel === options_1.LogLevel.None)
        return false;
    if (options_1.globalOptions.logLevel > level)
        return false;
    return true;
}


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function simpleCombineReducers(reducers) {
    var reducerKeys = Object.keys(reducers);
    return function combination(state, action) {
        if (state === void 0) { state = {}; }
        var hasChanged = false;
        var nextState = {};
        for (var _i = 0, reducerKeys_1 = reducerKeys; _i < reducerKeys_1.length; _i++) {
            var key = reducerKeys_1[_i];
            var reducer = reducers[key];
            var previousStateForKey = state[key];
            var nextStateForKey = reducer(previousStateForKey, action);
            nextState[key] = nextStateForKey;
            hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
        }
        return hasChanged ? nextState : state;
    };
}
exports.simpleCombineReducers = simpleCombineReducers;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var symbols_1 = __webpack_require__(0);
function withId(id) {
    return function (target, propertyKey) {
        if (!target[symbols_1.WITH_ID])
            target[symbols_1.WITH_ID] = {};
        target[symbols_1.WITH_ID][propertyKey] = id || symbols_1.AUTO_ID;
    };
}
exports.withId = withId;


/***/ })
/******/ ]);
});
//# sourceMappingURL=redux-app.js.map