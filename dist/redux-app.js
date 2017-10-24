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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function setSymbol(obj, symbol, value) {
    return obj[symbol] = value;
}
exports.setSymbol = setSymbol;
function getSymbol(obj, symbol) {
    return obj[symbol];
}
exports.getSymbol = getSymbol;
exports.REDUCER = Symbol('REDUX-APP.COMPONENT.REDUCER');
exports.DISPOSE = Symbol('REDUX-APP.COMPONENT.DISPOSE');
exports.COMPONENT_ID = Symbol('REDUX-APP.COMPONENT.ID');
exports.COMPONENT_SCHEMA = Symbol('REDUX-APP.COMPONENT_SCHEMA');
exports.COMPONENT_SCHEMA_OPTIONS = Symbol('REDUX-APP.COMPONENT_SCHEMA.OPTIONS');
exports.COMPONENT_SCHEMA_CLASS = Symbol('REDUX-APP.COMPONENT_SCHEMA.CLASS');
exports.NO_DISPATCH = Symbol('REDUX-APP.COMPONENT_SCHEMA.NO_DISPATCH');
exports.COMPUTED = Symbol('REDUX-APP.COMPONENT_SCHEMA.COMPUTED');
exports.WITH_ID = Symbol('REDUX-APP.COMPONENT_SCHEMA.WITH_ID');
exports.AUTO_ID = Symbol('REDUX-APP.COMPONENT_SCHEMA.AUTO_ID');


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(10));
__export(__webpack_require__(12));
__export(__webpack_require__(13));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var components_1 = __webpack_require__(3);
var utils_1 = __webpack_require__(1);
var symbols_1 = __webpack_require__(0);
var snakecase = __webpack_require__(11);
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
    components_1.assertComponentSchema(schema);
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
    LogLevel[LogLevel["Warn"] = 5] = "Warn";
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(4));
__export(__webpack_require__(6));


/***/ }),
/* 4 */
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
var decorators_1 = __webpack_require__(5);
var options_1 = __webpack_require__(2);
var symbols_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(1);
var componentSchema_1 = __webpack_require__(6);
var Component = (function () {
    function Component(store, schema, parentSchema, path, visited) {
        if (path === void 0) { path = []; }
        if (visited === void 0) { visited = new Set(); }
        if (!componentSchema_1.isComponentSchema(schema))
            throw new Error("Argument '" + "schema" + "' is not a component schema. Did you forget to use the decorator?");
        createSelf(this, store, schema, parentSchema, path);
        createSubComponents(this, store, schema, path, visited);
        utils_1.log.debug("[Component] new " + schema.constructor.name + " component created. path: root." + path.join('.'));
    }
    Component.create = function (store, schema, parent, path, visited) {
        if (path === void 0) { path = []; }
        if (visited === void 0) { visited = new Set(); }
        var ComponentClass = componentSchema_1.getComponentClass(schema, store.dispatch);
        return new ComponentClass(store, schema, parent, path, visited);
    };
    Component.prototype.disposeComponent = function () {
        var disposables = symbols_1.getSymbol(this, symbols_1.DISPOSE);
        while (disposables.length) {
            var disposable = disposables.pop();
            if (disposable && disposable.dispose)
                disposable.dispose();
        }
    };
    return Component;
}());
exports.Component = Component;
function createSelf(component, store, schema, parentSchema, path) {
    symbols_1.setSymbol(component, symbols_1.DISPOSE, []);
    decorators_1.setComponentId(component, parentSchema, path);
    decorators_1.addComputed(component, schema);
    for (var _i = 0, _a = Object.keys(schema); _i < _a.length; _i++) {
        var key = _a[_i];
        component[key] = schema[key];
    }
    symbols_1.setSymbol(component, symbols_1.REDUCER, createReducer(component, schema));
    var options = options_1.getSchemaOptions(schema);
    if (options.updateState) {
        var unsubscribe_1 = store.subscribe(function () { return updateState(component, store.getState(), path); });
        symbols_1.getSymbol(component, symbols_1.DISPOSE).push({ dispose: function () { return unsubscribe_1(); } });
    }
}
function createSubComponents(obj, store, schema, path, visited) {
    if (visited.has(obj))
        return;
    visited.add(obj);
    if (utils_1.isPrimitive(obj))
        return;
    var searchIn = schema || obj;
    for (var _i = 0, _a = Object.keys(searchIn); _i < _a.length; _i++) {
        var key = _a[_i];
        var subSchema = searchIn[key];
        var subPath = path.concat([key]);
        if (componentSchema_1.isComponentSchema(subSchema)) {
            obj[key] = Component.create(store, subSchema, schema, subPath, visited);
        }
        else {
            createSubComponents(obj[key], store, null, subPath, visited);
        }
    }
}
function createReducer(component, schema) {
    var methods = utils_1.getMethods(schema);
    var methodNames = {};
    Object.keys(methods).forEach(function (methName) {
        var actionName = options_1.getActionName(methName, schema);
        methodNames[actionName] = methName;
    });
    var componentId = symbols_1.getSymbol(component, symbols_1.COMPONENT_ID);
    return function (state, action) {
        utils_1.log.verbose("[reducer] reducer of: " + schema.constructor.name + ", action: " + action.type);
        if (state === undefined) {
            utils_1.log.verbose('[reducer] state is undefined, returning initial value');
            return schema;
        }
        if (componentId !== action.id) {
            utils_1.log.verbose("[reducer] component id and action.id don't match (" + componentId + " !== " + action.id + ")");
            return state;
        }
        var methodName = methodNames[action.type];
        var actionReducer = methods[methodName];
        if (!actionReducer) {
            utils_1.log.verbose('[reducer] no matching action in this reducer, returning previous state');
            return state;
        }
        var newState = Object.assign({}, state);
        actionReducer.call.apply(actionReducer, [newState].concat(action.payload));
        utils_1.log.verbose('[reducer] reducer invoked, returning new state');
        return newState;
    };
}
var identityReducer = function (state) { return state; };
function getReducerFromTree(obj, path, visited) {
    if (path === void 0) { path = []; }
    if (visited === void 0) { visited = new Set(); }
    if (visited.has(obj))
        return undefined;
    visited.add(obj);
    if (utils_1.isPrimitive(obj))
        return undefined;
    var rootReducer = symbols_1.getSymbol(obj, symbols_1.REDUCER) || identityReducer;
    var subReducers = {};
    for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
        var key = _a[_i];
        var newSubReducer = getReducerFromTree(obj[key], path.concat(key), visited);
        if (typeof newSubReducer === 'function')
            subReducers[key] = newSubReducer;
    }
    var resultReducer = rootReducer;
    if (Object.keys(subReducers).length) {
        var combinedSubReducer = utils_1.simpleCombineReducers(subReducers);
        resultReducer = function (state, action) {
            var thisState = rootReducer(state, action);
            var subStates = combinedSubReducer(thisState, action);
            var combinedState = __assign({}, thisState, subStates);
            return combinedState;
        };
    }
    return decorators_1.reducerWithComputed(resultReducer, obj);
}
exports.getReducerFromTree = getReducerFromTree;
function updateState(component, newGlobalState, path) {
    var self = component;
    var newScopedState = utils_1.getProp(newGlobalState, path);
    utils_1.log.verbose('[updateState] updating component in path: ', path.join('.'));
    utils_1.log.verbose('[updateState] store before: ', newScopedState);
    utils_1.log.verbose('[updateState] component before: ', component);
    var propsAssigned = [];
    Object.keys(newScopedState).forEach(function (key) {
        if (self[key] !== newScopedState[key] && !(self[key] instanceof Component)) {
            self[key] = newScopedState[key];
            propsAssigned.push(key);
        }
    });
    var propsDeleted = [];
    Object.keys(component).forEach(function (key) {
        if (!newScopedState.hasOwnProperty(key)) {
            delete self[key];
            propsDeleted.push(key);
        }
    });
    if (propsDeleted.length || propsAssigned.length) {
        utils_1.log.verbose('[updateState] store after: ', newScopedState);
        utils_1.log.verbose('[updateState] component after: ', component);
        utils_1.log.debug("[updateState] state of " + path.join('.') + " changed");
        if (propsDeleted.length) {
            utils_1.log.debug('[updateState] props deleted: ', propsDeleted);
        }
        else {
            utils_1.log.verbose('[updateState] props deleted: ', propsDeleted);
        }
        if (propsAssigned.length) {
            utils_1.log.debug('[updateState] props assigned: ', propsAssigned);
        }
        else {
            utils_1.log.verbose('[updateState] props assigned: ', propsAssigned);
        }
    }
    else {
        utils_1.log.verbose('[updateState] no change');
    }
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(9));
__export(__webpack_require__(14));
__export(__webpack_require__(15));


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var options_1 = __webpack_require__(2);
var symbols_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(1);
var component_1 = __webpack_require__(4);
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
function getComponentClass(schema, dispatch) {
    var type = symbols_1.getSymbol(schema, symbols_1.COMPONENT_SCHEMA_CLASS);
    if (!type) {
        type = createComponentClass(schema, dispatch);
    }
    return type;
}
exports.getComponentClass = getComponentClass;
function componentSchemaDecorator(ctor, options) {
    symbols_1.setSymbol(ctor, symbols_1.COMPONENT_SCHEMA, true);
    symbols_1.setSymbol(ctor, symbols_1.COMPONENT_SCHEMA_OPTIONS, options);
}
function createComponentClass(schema, dispatch) {
    var ComponentClass = (function (_super) {
        __extends(ComponentClass, _super);
        function ComponentClass(store, schemaArg) {
            var params = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                params[_i - 2] = arguments[_i];
            }
            return _super.apply(this, [store, schemaArg].concat(params)) || this;
        }
        return ComponentClass;
    }(component_1.Component));
    var actions = createActions(schema, dispatch);
    Object.assign(ComponentClass.prototype, actions);
    var proto = Object.getPrototypeOf(schema);
    return symbols_1.setSymbol(proto, symbols_1.COMPONENT_SCHEMA_CLASS, ComponentClass);
}
function createActions(schema, dispatch) {
    var methods = utils_1.getMethods(schema);
    if (!methods)
        return undefined;
    var componentActions = {};
    Object.keys(methods).forEach(function (key) {
        componentActions[key] = function () {
            var payload = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                payload[_i] = arguments[_i];
            }
            if (!(this instanceof component_1.Component)) {
                var msg = "Component method invoked with non-Component as 'this'. " +
                    "Some redux-app features such as the withId decorator will not work. Bound 'this' argument is: ";
                utils_1.log.warn(msg, this);
            }
            var oldMethod = methods[key];
            if (symbols_1.getSymbol(oldMethod, symbols_1.NO_DISPATCH)) {
                oldMethod.call.apply(oldMethod, [this].concat(payload));
            }
            else {
                dispatch({
                    type: options_1.getActionName(key, schema),
                    id: symbols_1.getSymbol(this, symbols_1.COMPONENT_ID),
                    payload: payload
                });
            }
        };
    });
    return componentActions;
}


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(8);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var components_1 = __webpack_require__(3);
exports.component = components_1.component;
var options_1 = __webpack_require__(2);
exports.SchemaOptions = options_1.SchemaOptions;
exports.GlobalOptions = options_1.GlobalOptions;
exports.LogLevel = options_1.LogLevel;
var reduxApp_1 = __webpack_require__(16);
exports.ReduxApp = reduxApp_1.ReduxApp;
var decorators_1 = __webpack_require__(5);
exports.computed = decorators_1.computed;
exports.noDispatch = decorators_1.noDispatch;
exports.sequence = decorators_1.sequence;
exports.withId = decorators_1.withId;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var symbols_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(1);
var dataDescriptor = {
    writable: true,
    configurable: true,
    enumerable: true
};
function computed(target, propertyKey) {
    var descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    if (typeof descriptor.get !== 'function')
        throw new Error("Failed to decorate '" + propertyKey + "'. The 'computed' decorator should only be used on getters.");
    if (descriptor.set)
        throw new Error("Failed to decorate '" + propertyKey + "'. Decorated property should not have a setter.");
    delete target[propertyKey];
    Object.defineProperty(target, propertyKey, dataDescriptor);
    var computedGetters = symbols_1.getSymbol(target, symbols_1.COMPUTED) || {};
    computedGetters[propertyKey] = descriptor.get;
    symbols_1.setSymbol(target, symbols_1.COMPUTED, computedGetters);
}
exports.computed = computed;
function reducerWithComputed(reducer, obj) {
    return function (state, action) {
        var newState = reducer(state, action);
        computeProps(obj, newState);
        return newState;
    };
}
exports.reducerWithComputed = reducerWithComputed;
function addComputed(component, schema) {
    var computedGetters = symbols_1.getSymbol(schema, symbols_1.COMPUTED);
    if (!computedGetters)
        return;
    for (var _i = 0, _a = Object.keys(computedGetters); _i < _a.length; _i++) {
        var propKey = _a[_i];
        delete component[propKey];
    }
    symbols_1.setSymbol(component, symbols_1.COMPUTED, computedGetters);
}
exports.addComputed = addComputed;
function computeProps(schema, state) {
    var computedGetters = symbols_1.getSymbol(schema, symbols_1.COMPUTED);
    if (!computedGetters)
        return;
    for (var _i = 0, _a = Object.keys(computedGetters); _i < _a.length; _i++) {
        var propKey = _a[_i];
        var getter = computedGetters[propKey];
        utils_1.log.verbose("[computeProps] computing new value of '" + propKey + "'");
        var newValue = getter.call(state);
        var oldValue = state[propKey];
        if (newValue !== oldValue) {
            utils_1.log.verbose("[computeProps] updating the state of '" + propKey + "'. New value: '" + newValue + "', Old value: '" + oldValue + "'.");
            delete state[propKey];
            state[propKey] = newValue;
        }
    }
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var options_1 = __webpack_require__(2);
var Log = (function () {
    function Log() {
    }
    Log.prototype.verbose = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (!this.shouldLog(options_1.LogLevel.Verbose))
            return;
        console.log.apply(console, ['[ReduxApp] [VERBOSE] ' + message].concat(optionalParams));
    };
    Log.prototype.debug = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (!this.shouldLog(options_1.LogLevel.Debug))
            return;
        console.log.apply(console, ['[ReduxApp] [DEBUG] ' + message].concat(optionalParams));
    };
    Log.prototype.warn = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (!this.shouldLog(options_1.LogLevel.Warn))
            return;
        console.warn.apply(console, ['[ReduxApp] [WARN] ' + message].concat(optionalParams));
    };
    Log.prototype.shouldLog = function (level) {
        if (options_1.globalOptions.logLevel === options_1.LogLevel.None)
            return false;
        if (options_1.globalOptions.logLevel > level)
            return false;
        return true;
    };
    return Log;
}());
exports.log = new Log();


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("lodash.snakecase");

/***/ }),
/* 12 */
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function isPrimitive(val) {
    if (!val)
        return true;
    var type = typeof val;
    return type !== 'object' && type !== 'function';
}
exports.isPrimitive = isPrimitive;
function getMethods(obj) {
    if (!obj)
        return undefined;
    var proto = Object.getPrototypeOf(obj);
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var symbols_1 = __webpack_require__(0);
function noDispatch(target, propertyKey) {
    noDispatchDecorator(target, propertyKey);
}
exports.noDispatch = noDispatch;
function sequence(target, propertyKey) {
    noDispatchDecorator(target, propertyKey);
}
exports.sequence = sequence;
function noDispatchDecorator(target, propertyKey) {
    target[propertyKey][symbols_1.NO_DISPATCH] = true;
}


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var symbols_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(1);
function withId(id) {
    return function (target, propertyKey) {
        if (!target[symbols_1.WITH_ID])
            target[symbols_1.WITH_ID] = {};
        target[symbols_1.WITH_ID][propertyKey] = id || symbols_1.AUTO_ID;
    };
}
exports.withId = withId;
function setComponentId(component, parent, path) {
    var componentId = getComponentId(parent, path);
    if (componentId !== undefined && componentId !== null) {
        symbols_1.setSymbol(component, symbols_1.COMPONENT_ID, componentId);
    }
}
exports.setComponentId = setComponentId;
var autoComponentId = 0;
function getComponentId(parent, path) {
    var anyParent = parent;
    if (!parent || !path.length)
        return undefined;
    var idLookup = anyParent[symbols_1.WITH_ID];
    if (!idLookup)
        return undefined;
    var selfKey = path[path.length - 1];
    var id = anyParent[symbols_1.WITH_ID][selfKey];
    if (!id)
        return undefined;
    if (id === symbols_1.AUTO_ID) {
        var generatedId = --autoComponentId;
        utils_1.log.verbose('[getComponentId] new component id generated: ' + generatedId);
        anyParent[symbols_1.WITH_ID][selfKey] = generatedId;
        return generatedId;
    }
    return id;
}


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = __webpack_require__(17);
var components_1 = __webpack_require__(3);
var options_1 = __webpack_require__(2);
var ReduxApp = (function () {
    function ReduxApp(appSchema) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var dummyReducer = function () { };
        this.store = redux_1.createStore.apply(void 0, [dummyReducer].concat(params));
        var rootComponent = components_1.Component.create(this.store, appSchema);
        this.root = rootComponent;
        var actualReducer = components_1.getReducerFromTree(rootComponent);
        this.store.replaceReducer(actualReducer);
    }
    ReduxApp.options = options_1.globalOptions;
    return ReduxApp;
}());
exports.ReduxApp = ReduxApp;


/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ })
/******/ ]);
});
//# sourceMappingURL=redux-app.js.map