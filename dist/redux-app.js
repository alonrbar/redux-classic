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

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(9));
__export(__webpack_require__(4));
__export(__webpack_require__(6));
__export(__webpack_require__(18));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var snakecase = __webpack_require__(11);
var SchemaOptions = (function () {
    function SchemaOptions() {
        this.actionNamespace = true;
        this.uppercaseActions = true;
    }
    return SchemaOptions;
}());
exports.SchemaOptions = SchemaOptions;
function getActionName(creator, methodName, options) {
    var actionName = methodName;
    var actionNamespace = creator.constructor.name;
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
var AppOptions = (function () {
    function AppOptions() {
        this.updateState = true;
    }
    return AppOptions;
}());
exports.AppOptions = AppOptions;
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
        this.emitClassNames = false;
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

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(13));
__export(__webpack_require__(14));
__export(__webpack_require__(15));


/***/ }),
/* 3 */
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
exports.COMPONENT_META = Symbol('REDUX-APP.COMPONENT_METADATA');
exports.COMPONENT_SCHEMA = Symbol('REDUX-APP.COMPONENT_SCHEMA');
exports.AUTO_ID = Symbol('REDUX-APP.AUTO_ID');


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var symbols_1 = __webpack_require__(3);
var Metadata = (function () {
    function Metadata() {
        this.disposables = [];
    }
    Metadata.getMeta = function (component) {
        return symbols_1.getSymbol(component, symbols_1.COMPONENT_META);
    };
    Metadata.createMeta = function (component) {
        return symbols_1.setSymbol(component, symbols_1.COMPONENT_META, new Metadata());
    };
    return Metadata;
}());
exports.Metadata = Metadata;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(10));
__export(__webpack_require__(12));
__export(__webpack_require__(16));
__export(__webpack_require__(17));


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var symbols_1 = __webpack_require__(3);
var utils_1 = __webpack_require__(2);
var Schema = (function () {
    function Schema() {
        this.computedGetters = {};
        this.noDispatch = {};
        this.childIds = {};
    }
    Schema.getSchema = function (obj) {
        if (!obj)
            return undefined;
        if (typeof obj === 'object') {
            return utils_1.getConstructorProp(obj, symbols_1.COMPONENT_SCHEMA);
        }
        else {
            return symbols_1.getSymbol(obj, symbols_1.COMPONENT_SCHEMA);
        }
    };
    Schema.getOrCreateSchema = function (obj) {
        var schema = Schema.getSchema(obj);
        if (!schema) {
            var isConstructor = (typeof obj === 'function' ? true : false);
            var target = (isConstructor ? obj : obj.constructor);
            schema = symbols_1.setSymbol(target, symbols_1.COMPONENT_SCHEMA, new Schema());
        }
        return schema;
    };
    Schema.assertSchema = function (obj, msg) {
        if (!Schema.getSchema(obj))
            throw new Error(msg || 'Invalid argument. Decorated component expected.');
    };
    return Schema;
}());
exports.Schema = Schema;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(8);


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var components_1 = __webpack_require__(0);
exports.isInstanceOf = components_1.isInstanceOf;
var decorators_1 = __webpack_require__(5);
exports.component = decorators_1.component;
exports.computed = decorators_1.computed;
exports.noDispatch = decorators_1.noDispatch;
exports.sequence = decorators_1.sequence;
exports.withId = decorators_1.withId;
var options_1 = __webpack_require__(1);
exports.SchemaOptions = options_1.SchemaOptions;
exports.GlobalOptions = options_1.GlobalOptions;
exports.LogLevel = options_1.LogLevel;
var reduxApp_1 = __webpack_require__(19);
exports.ReduxApp = reduxApp_1.ReduxApp;


/***/ }),
/* 9 */
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
var options_1 = __webpack_require__(1);
var utils_1 = __webpack_require__(2);
var metadata_1 = __webpack_require__(4);
var schema_1 = __webpack_require__(6);
var Component = (function () {
    function Component(store, creator, parentCreator, path, visited) {
        if (path === void 0) { path = []; }
        if (visited === void 0) { visited = new Set(); }
        if (!schema_1.Schema.getSchema(creator))
            throw new Error("Argument '" + "creator" + "' is not a component creator. Did you forget to use the decorator?");
        Component.createSelf(this, store, creator, parentCreator, path);
        Component.createSubComponents(this, store, creator, path, visited);
        utils_1.log.debug("[Component] New " + creator.constructor.name + " component created. path: root." + path.join('.'));
    }
    Component.create = function (store, creator, parent, path, visited) {
        if (path === void 0) { path = []; }
        if (visited === void 0) { visited = new Set(); }
        var ComponentClass = Component.getComponentClass(creator);
        return new ComponentClass(store, creator, parent, path, visited);
    };
    Component.getReducerFromTree = function (obj, path, visited) {
        if (path === void 0) { path = []; }
        if (visited === void 0) { visited = new Set(); }
        if (utils_1.isPrimitive(obj))
            return undefined;
        if (visited.has(obj))
            return undefined;
        visited.add(obj);
        var rootReducer;
        var meta = metadata_1.Metadata.getMeta(obj);
        if (meta) {
            rootReducer = meta.reducer;
        }
        else {
            rootReducer = Component.identityReducer;
        }
        var subReducers = {};
        for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
            var key = _a[_i];
            var newSubReducer = Component.getReducerFromTree(obj[key], path.concat(key), visited);
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
        return decorators_1.Computed.wrapReducer(resultReducer, obj);
    };
    Component.getComponentClass = function (creator) {
        var schema = schema_1.Schema.getSchema(creator);
        if (!schema.componentClass) {
            schema.componentClass = Component.createComponentClass(creator);
            schema.originalClass = creator.constructor;
        }
        return schema.componentClass;
    };
    Component.createComponentClass = function (creator) {
        var ComponentClass = (function (_super) {
            __extends(ComponentClass, _super);
            function ComponentClass(store, creatorArg) {
                var params = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    params[_i - 2] = arguments[_i];
                }
                var _this = _super.apply(this, [store, creatorArg].concat(params)) || this;
                _this.__originalClassName__ = creator.constructor.name;
                if (!options_1.globalOptions.emitClassNames)
                    delete _this.__originalClassName__;
                return _this;
            }
            return ComponentClass;
        }(Component));
        var actions = Component.createActions(creator);
        Object.assign(ComponentClass.prototype, actions);
        return ComponentClass;
    };
    Component.createActions = function (creator) {
        var methods = utils_1.getMethods(creator);
        if (!methods)
            return undefined;
        var schema = schema_1.Schema.getSchema(creator);
        var componentActions = {};
        Object.keys(methods).forEach(function (key) {
            componentActions[key] = function () {
                var payload = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    payload[_i] = arguments[_i];
                }
                if (!(this instanceof Component))
                    throw new Error("Component method invoked with non-Component as 'this'. Bound 'this' argument is: " + this);
                var oldMethod = methods[key];
                if (schema.noDispatch[key]) {
                    oldMethod.call.apply(oldMethod, [this].concat(payload));
                }
                else {
                    var meta = metadata_1.Metadata.getMeta(this);
                    meta.dispatch({
                        type: options_1.getActionName(creator, key, schema.options),
                        id: (meta ? meta.id : undefined),
                        payload: payload
                    });
                }
            };
        });
        return componentActions;
    };
    Component.createSelf = function (component, store, creator, parentCreator, path) {
        for (var _i = 0, _a = Object.keys(creator); _i < _a.length; _i++) {
            var key = _a[_i];
            component[key] = creator[key];
        }
        var meta = metadata_1.Metadata.createMeta(component);
        meta.id = decorators_1.ComponentId.getComponentId(parentCreator, path);
        meta.dispatch = store.dispatch;
        var schema = schema_1.Schema.getSchema(creator);
        meta.originalClass = schema.originalClass;
        decorators_1.Computed.setupComputedProps(component, schema, meta);
        meta.reducer = Component.createReducer(component, creator);
    };
    Component.createSubComponents = function (obj, store, creator, path, visited) {
        if (utils_1.isPrimitive(obj))
            return;
        if (visited.has(obj))
            return;
        visited.add(obj);
        var searchIn = creator || obj;
        for (var _i = 0, _a = Object.keys(searchIn); _i < _a.length; _i++) {
            var key = _a[_i];
            var subPath = path.concat([key]);
            var subCreator = searchIn[key];
            if (schema_1.Schema.getSchema(subCreator)) {
                obj[key] = Component.create(store, subCreator, creator, subPath, visited);
            }
            else {
                Component.createSubComponents(obj[key], store, null, subPath, visited);
            }
        }
    };
    Component.createReducer = function (component, creator) {
        var methods = utils_1.getMethods(creator);
        var options = schema_1.Schema.getSchema(creator).options;
        var methodNames = {};
        Object.keys(methods).forEach(function (methName) {
            var actionName = options_1.getActionName(creator, methName, options);
            methodNames[actionName] = methName;
        });
        var componentId = metadata_1.Metadata.getMeta(component).id;
        return function (state, action) {
            utils_1.log.verbose("[reducer] Reducer of: " + creator.constructor.name + ", action: " + action.type);
            if (state === undefined) {
                utils_1.log.verbose('[reducer] State is undefined, returning initial value');
                return component;
            }
            if (componentId !== action.id) {
                utils_1.log.verbose("[reducer] Component id and action.id don't match (" + componentId + " !== " + action.id + ")");
                return state;
            }
            var methodName = methodNames[action.type];
            var actionReducer = methods[methodName];
            if (!actionReducer) {
                utils_1.log.verbose('[reducer] No matching action in this reducer, returning previous state');
                return state;
            }
            var newState = Object.assign({}, state);
            actionReducer.call.apply(actionReducer, [newState].concat(action.payload));
            utils_1.log.verbose('[reducer] Reducer invoked, returning new state');
            return newState;
        };
    };
    Component.identityReducer = function (state) { return state; };
    return Component;
}());
exports.Component = Component;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var options_1 = __webpack_require__(1);
var components_1 = __webpack_require__(0);
function component(ctorOrOptions) {
    if (typeof ctorOrOptions === 'function') {
        componentDecorator.call(undefined, ctorOrOptions);
    }
    else {
        return function (ctor) { return componentDecorator(ctor, ctorOrOptions); };
    }
}
exports.component = component;
function componentDecorator(ctor, options) {
    var schema = components_1.Schema.getOrCreateSchema(ctor);
    schema.options = Object.assign({}, options, new options_1.SchemaOptions(), options_1.globalOptions.schema);
}


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("lodash.snakecase");

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var components_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(2);
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
    var schema = components_1.Schema.getOrCreateSchema(target);
    schema.computedGetters[propertyKey] = descriptor.get;
}
exports.computed = computed;
var Computed = (function () {
    function Computed() {
    }
    Computed.wrapReducer = function (reducer, obj) {
        return function (state, action) {
            var newState = reducer(state, action);
            Computed.computeProps(obj, newState);
            return newState;
        };
    };
    Computed.setupComputedProps = function (component, schema, meta) {
        for (var _i = 0, _a = Object.keys(schema.computedGetters); _i < _a.length; _i++) {
            var propKey = _a[_i];
            delete component[propKey];
        }
        meta.computedGetters = schema.computedGetters;
    };
    Computed.computeProps = function (obj, state) {
        var meta = components_1.Metadata.getMeta(obj);
        if (!meta)
            return;
        for (var _i = 0, _a = Object.keys(meta.computedGetters); _i < _a.length; _i++) {
            var propKey = _a[_i];
            var getter = meta.computedGetters[propKey];
            utils_1.log.verbose("[computeProps] computing new value of '" + propKey + "'");
            var newValue = getter.call(state);
            var oldValue = state[propKey];
            if (newValue !== oldValue) {
                utils_1.log.verbose("[computeProps] updating the state of '" + propKey + "'. New value: '" + newValue + "', Old value: '" + oldValue + "'.");
                delete state[propKey];
                state[propKey] = newValue;
            }
        }
    };
    return Computed;
}());
exports.Computed = Computed;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var options_1 = __webpack_require__(1);
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
        console.debug.apply(console, ['VERBOSE [redux-app] ' + message].concat(optionalParams));
    };
    Log.prototype.debug = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (!this.shouldLog(options_1.LogLevel.Debug))
            return;
        console.log.apply(console, ['DEBUG [redux-app] ' + message].concat(optionalParams));
    };
    Log.prototype.warn = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (!this.shouldLog(options_1.LogLevel.Warn))
            return;
        console.warn.apply(console, ['WARN [redux-app] ' + message].concat(optionalParams));
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
/* 14 */
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
/* 15 */
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var components_1 = __webpack_require__(0);
function noDispatch(target, propertyKey) {
    noDispatchDecorator(target, propertyKey);
}
exports.noDispatch = noDispatch;
function sequence(target, propertyKey) {
    noDispatchDecorator(target, propertyKey);
}
exports.sequence = sequence;
function noDispatchDecorator(target, propertyKey) {
    var schema = components_1.Schema.getOrCreateSchema(target);
    schema.noDispatch[propertyKey] = true;
}


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var components_1 = __webpack_require__(0);
var symbols_1 = __webpack_require__(3);
var utils_1 = __webpack_require__(2);
function withId(id) {
    return function (target, propertyKey) {
        var schema = components_1.Schema.getOrCreateSchema(target);
        schema.childIds[propertyKey] = id || symbols_1.AUTO_ID;
    };
}
exports.withId = withId;
var ComponentId = (function () {
    function ComponentId() {
    }
    ComponentId.getComponentId = function (parentCreator, path) {
        var schema = components_1.Schema.getSchema(parentCreator);
        if (!parentCreator || !path.length)
            return undefined;
        var selfKey = path[path.length - 1];
        var id = schema.childIds[selfKey];
        if (!id)
            return undefined;
        if (id === symbols_1.AUTO_ID) {
            var generatedId = --ComponentId.autoComponentId;
            utils_1.log.verbose('[getComponentId] new component id generated: ' + generatedId);
            schema.childIds[selfKey] = generatedId;
            return generatedId;
        }
        return id;
    };
    ComponentId.autoComponentId = 0;
    return ComponentId;
}());
exports.ComponentId = ComponentId;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var metadata_1 = __webpack_require__(4);
function isInstanceOf(obj, type) {
    if (obj instanceof type)
        return true;
    var meta = metadata_1.Metadata.getMeta(obj);
    return !!(meta && meta.originalClass === type);
}
exports.isInstanceOf = isInstanceOf;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = __webpack_require__(20);
var components_1 = __webpack_require__(0);
var options_1 = __webpack_require__(1);
var utils_1 = __webpack_require__(2);
var VisitCounter = (function () {
    function VisitCounter() {
        this.value = 0;
    }
    return VisitCounter;
}());
var ReduxApp = (function () {
    function ReduxApp(appCreator) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var _this = this;
        var _a = this.resolveParameters(params), options = _a.options, storeParams = _a.storeParams;
        var initialReducer = function (state) { return state; };
        this.store = redux_1.createStore.apply(void 0, [initialReducer].concat(storeParams));
        var rootComponent = components_1.Component.create(this.store, appCreator);
        this.root = rootComponent;
        if (options.updateState) {
            this.subscriptionDisposer = this.store.subscribe(function () { return _this.updateState(); });
        }
        var actualReducer = components_1.Component.getReducerFromTree(rootComponent);
        this.store.replaceReducer(actualReducer);
    }
    ReduxApp.prototype.dispose = function () {
        if (this.subscriptionDisposer) {
            this.subscriptionDisposer();
            this.subscriptionDisposer = null;
        }
    };
    ReduxApp.prototype.updateState = function () {
        var newState = this.store.getState();
        utils_1.log.verbose('[updateState] Store before: ', newState);
        var counter = new VisitCounter();
        var visited = new Set();
        this.updateStateRecursion(this.root, newState, [], visited, counter);
        utils_1.log.verbose('[updateState] Store after: ', newState);
    };
    ReduxApp.prototype.updateStateRecursion = function (obj, newState, path, visited, counter) {
        var _this = this;
        counter.value++;
        if (utils_1.isPrimitive(obj) || utils_1.isPrimitive(newState))
            return newState;
        if (visited.has(obj))
            return obj;
        visited.add(obj);
        var pathStr = 'root' + (path.length ? '.' : '') + path.join('.');
        utils_1.log.verbose("[updateState] Updating app state in path '" + pathStr + "'");
        utils_1.log.verbose('[updateState] Scoped app state before: ', obj);
        var propsDeleted = [];
        Object.keys(obj).forEach(function (key) {
            if (!newState.hasOwnProperty(key)) {
                delete obj[key];
                propsDeleted.push(key);
            }
        });
        var propsAssigned = [];
        Object.keys(newState).forEach(function (key) {
            var subState = newState[key];
            var subObj = obj[key];
            var newSubObj = _this.updateStateRecursion(subObj, subState, path.concat(key), visited, counter);
            if (newSubObj !== subObj) {
                obj[key] = newSubObj;
                propsAssigned.push(key);
            }
        });
        if (propsDeleted.length || propsAssigned.length) {
            utils_1.log.debug("[updateState] App state in path '" + pathStr + "' changed");
            utils_1.log.verbose('[updateState] Scoped app state after: ', obj);
            if (propsDeleted.length) {
                utils_1.log.debug('[updateState] Props deleted: ', propsDeleted);
            }
            else {
                utils_1.log.verbose('[updateState] Props deleted: ', propsDeleted);
            }
            if (propsAssigned.length) {
                utils_1.log.debug('[updateState] Props assigned: ', propsAssigned);
            }
            else {
                utils_1.log.verbose('[updateState] Props assigned: ', propsAssigned);
            }
        }
        else {
            utils_1.log.verbose("[updateState] No Change in path '" + pathStr + "'");
        }
        return obj;
    };
    ReduxApp.prototype.resolveParameters = function (params) {
        var result = {};
        if (params.length === 0) {
            result.options = new options_1.AppOptions();
        }
        else if (params.length === 1) {
            if (typeof params[0] === 'function') {
                result.storeParams = params;
                result.options = new options_1.AppOptions();
            }
            else {
                result.options = Object.assign(new options_1.AppOptions(), params[0]);
            }
        }
        else {
            result.options = Object.assign(new options_1.AppOptions(), params[0]);
            result.storeParams = params.slice(1);
        }
        return result;
    };
    ReduxApp.options = options_1.globalOptions;
    return ReduxApp;
}());
exports.ReduxApp = ReduxApp;


/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ })
/******/ ]);
});
//# sourceMappingURL=redux-app.js.map