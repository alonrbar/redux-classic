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
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
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
__export(__webpack_require__(10));
__export(__webpack_require__(5));
__export(__webpack_require__(7));
__export(__webpack_require__(23));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(14));
__export(__webpack_require__(15));
__export(__webpack_require__(16));
__export(__webpack_require__(17));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var snakecase = __webpack_require__(12);
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
        this.logLevel = LogLevel.Warn;
        this.emitClassNames = false;
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

Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = __webpack_require__(20);
var components_1 = __webpack_require__(0);
var options_1 = __webpack_require__(2);
var utils_1 = __webpack_require__(1);
exports.DEFAULT_APP_NAME = 'default';
exports.appsRepository = {};
var appsCount = 0;
var ReduxApp = (function () {
    function ReduxApp(appCreator) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var _this = this;
        this.warehouse = new Map();
        var _a = this.resolveParameters(params), options = _a.options, preLoadedState = _a.preLoadedState, enhancer = _a.enhancer;
        this.name = this.getAppName(options.name);
        if (exports.appsRepository[this.name])
            throw new Error("An app with name '" + this.name + "' already exists.");
        exports.appsRepository[this.name] = this;
        var initialReducer = function (state) { return state; };
        this.store = redux_1.createStore(initialReducer, preLoadedState, enhancer);
        var rootComponent = components_1.Component.create(this.store, appCreator, null, [this.name]);
        this.root = rootComponent;
        if (options.updateState) {
            this.subscriptionDisposer = this.store.subscribe(function () { return _this.updateState(); });
        }
        var actualReducer = components_1.Component.getReducerFromTree(rootComponent);
        this.store.replaceReducer(actualReducer);
    }
    ReduxApp.createApp = function (appCreator) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return new (ReduxApp.bind.apply(ReduxApp, [void 0, appCreator].concat(params)))();
    };
    ReduxApp.prototype.dispose = function () {
        if (this.subscriptionDisposer) {
            this.subscriptionDisposer();
            this.subscriptionDisposer = null;
        }
        if (exports.appsRepository[this.name]) {
            delete exports.appsRepository[this.name];
        }
    };
    ReduxApp.prototype.getTypeWarehouse = function (type) {
        if (!this.warehouse.has(type))
            this.warehouse.set(type, new Map());
        return this.warehouse.get(type);
    };
    ReduxApp.prototype.getAppName = function (name) {
        if (name)
            return name;
        if (!Object.keys(exports.appsRepository).length) {
            return exports.DEFAULT_APP_NAME;
        }
        else {
            return exports.DEFAULT_APP_NAME + '_' + (++appsCount);
        }
    };
    ReduxApp.prototype.updateState = function () {
        var newState = this.store.getState();
        utils_1.log.verbose('[updateState] Store before: ', newState);
        var visited = new Set();
        this.updateStateRecursion(this.root, newState, [], visited);
        utils_1.log.verbose('[updateState] Store after: ', newState);
    };
    ReduxApp.prototype.updateStateRecursion = function (obj, newState, path, visited) {
        if (obj === newState)
            return newState;
        if (utils_1.isPrimitive(obj) || utils_1.isPrimitive(newState))
            return newState;
        if (visited.has(obj))
            return obj;
        visited.add(obj);
        var targetType = obj.constructor;
        var newStateType = newState.constructor;
        if ((targetType === newStateType) || newStateType === Object) {
            var changeMessage;
            if (Array.isArray(obj) && Array.isArray(newState)) {
                changeMessage = this.updateArray(obj, newState, path, visited);
            }
            else {
                changeMessage = this.updateObject(obj, newState, path, visited);
            }
        }
        else {
            return newState;
        }
        if (changeMessage && changeMessage.length) {
            utils_1.log.debug("[updateState] App state in path '" + utils_1.pathString(path) + "' changed.");
            utils_1.log.debug("[updateState] " + changeMessage);
            utils_1.log.verbose("[updateState] New state: ", obj);
        }
        else {
            utils_1.log.verbose("[updateState] No change in path '" + utils_1.pathString(path) + "'.");
        }
        return obj;
    };
    ReduxApp.prototype.updateObject = function (obj, newState, path, visited) {
        var _this = this;
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
            var newSubObj = _this.updateStateRecursion(subObj, subState, path.concat(key), visited);
            if (newSubObj !== subObj) {
                obj[key] = newSubObj;
                propsAssigned.push(key);
            }
        });
        if (propsDeleted.length || propsAssigned.length) {
            var propsDeleteMessage = "Props deleted: " + (propsDeleted.length ? propsDeleted.join(', ') : '<none>') + ".";
            var propsAssignedMessage = "Props assigned: " + (propsAssigned.length ? propsAssigned.join(', ') : '<none>') + ".";
            return propsAssignedMessage + ' ' + propsDeleteMessage;
        }
        else {
            return null;
        }
    };
    ReduxApp.prototype.updateArray = function (arr, newState, path, visited) {
        var changeMessage = [];
        var prevLength = arr.length;
        var newLength = newState.length;
        var itemsAssigned = [];
        for (var i = 0; i < Math.min(prevLength, newLength); i++) {
            var subState = newState[i];
            var subObj = arr[i];
            var newSubObj = this.updateStateRecursion(subObj, subState, path.concat(i.toString()), visited);
            if (newSubObj !== subObj) {
                arr[i] = newSubObj;
                itemsAssigned.push(i);
            }
        }
        if (itemsAssigned.length)
            changeMessage.push("Assigned item(s) at indexes " + itemsAssigned.join(', ') + ".");
        if (newLength > prevLength) {
            var newItems = newState.slice(prevLength);
            Array.prototype.push.apply(arr, newItems);
            changeMessage.push("Added " + (newLength - prevLength) + " item(s) at index " + prevLength + ".");
        }
        else if (prevLength > newLength) {
            arr.splice(newLength);
            changeMessage.push("Removed " + (prevLength - newLength) + " item(s) at index " + newLength + ".");
        }
        return changeMessage.join(' ');
    };
    ReduxApp.prototype.resolveParameters = function (params) {
        var result = {};
        if (params.length === 0) {
            result.options = new options_1.AppOptions();
        }
        else if (params.length === 1) {
            if (typeof params[0] === 'function') {
                result.options = new options_1.AppOptions();
                result.enhancer = params[0];
            }
            else {
                result.options = Object.assign(new options_1.AppOptions(), params[0]);
            }
        }
        else if (params.length === 2) {
            result.options = Object.assign(new options_1.AppOptions(), params[0]);
            result.preLoadedState = JSON.parse(JSON.stringify(params[1]));
        }
        else {
            result.options = Object.assign(new options_1.AppOptions(), params[0]);
            result.preLoadedState = JSON.parse(JSON.stringify(params[1]));
            result.enhancer = params[2];
        }
        return result;
    };
    ReduxApp.options = options_1.globalOptions;
    return ReduxApp;
}());
exports.ReduxApp = ReduxApp;


/***/ }),
/* 4 */
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var symbols_1 = __webpack_require__(4);
var Metadata = (function () {
    function Metadata() {
        this.disposables = [];
        this.computedGetters = {};
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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(11));
__export(__webpack_require__(13));
__export(__webpack_require__(18));
__export(__webpack_require__(21));
__export(__webpack_require__(22));


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var symbols_1 = __webpack_require__(4);
var utils_1 = __webpack_require__(1);
var Schema = (function () {
    function Schema() {
        this.computedGetters = {};
        this.connectedProps = {};
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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(9);


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var components_1 = __webpack_require__(0);
exports.isInstanceOf = components_1.isInstanceOf;
var decorators_1 = __webpack_require__(6);
exports.component = decorators_1.component;
exports.connect = decorators_1.connect;
exports.computed = decorators_1.computed;
exports.noDispatch = decorators_1.noDispatch;
exports.sequence = decorators_1.sequence;
exports.withId = decorators_1.withId;
var options_1 = __webpack_require__(2);
exports.SchemaOptions = options_1.SchemaOptions;
exports.AppOptions = options_1.AppOptions;
exports.GlobalOptions = options_1.GlobalOptions;
exports.LogLevel = options_1.LogLevel;
var reduxApp_1 = __webpack_require__(3);
exports.ReduxApp = reduxApp_1.ReduxApp;


/***/ }),
/* 10 */
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
var decorators_1 = __webpack_require__(6);
var options_1 = __webpack_require__(2);
var reduxApp_1 = __webpack_require__(3);
var utils_1 = __webpack_require__(1);
var metadata_1 = __webpack_require__(5);
var schema_1 = __webpack_require__(7);
var Component = (function () {
    function Component(store, creator, parentCreator, path, visited) {
        if (path === void 0) { path = []; }
        if (visited === void 0) { visited = new Set(); }
        if (!schema_1.Schema.getSchema(creator))
            throw new Error("Argument '" + "creator" + "' is not a component creator. Did you forget to use the decorator?");
        Component.createSelf(this, store, creator, parentCreator, path);
        Component.createSubComponents(this, store, creator, path, visited);
        utils_1.log.debug("[Component] New " + creator.constructor.name + " component created. path: " + utils_1.pathString(path));
    }
    Component.create = function (store, creator, parentCreator, path, visited) {
        if (path === void 0) { path = []; }
        if (visited === void 0) { visited = new Set(); }
        var ComponentClass = Component.getComponentClass(creator);
        var component = new ComponentClass(store, creator, parentCreator, path, visited);
        var appName = path[0] || reduxApp_1.DEFAULT_APP_NAME;
        var app = reduxApp_1.appsRepository[appName];
        var selfPropName = path[path.length - 1];
        var isConnected = schema_1.Schema.getSchema(creator).connectedProps[selfPropName];
        if (app && !isConnected) {
            var warehouse = app.getTypeWarehouse(creator.constructor);
            var key = metadata_1.Metadata.getMeta(component).id || warehouse.size;
            warehouse.set(key, component);
        }
        return component;
    };
    Component.getReducerFromTree = function (obj, visited) {
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
            var newSubReducer = Component.getReducerFromTree(obj[key], visited);
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
        for (var _i = 0, _a = Object.getOwnPropertyNames(creator); _i < _a.length; _i++) {
            var key = _a[_i];
            var desc = Object.getOwnPropertyDescriptor(creator, key);
            Object.defineProperty(component, key, desc);
        }
        var meta = metadata_1.Metadata.createMeta(component);
        var schema = schema_1.Schema.getSchema(creator);
        meta.id = decorators_1.ComponentId.getComponentId(parentCreator, path);
        meta.originalClass = schema.originalClass;
        decorators_1.Computed.setupComputedProps(component, schema, meta);
        meta.dispatch = store.dispatch;
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var options_1 = __webpack_require__(2);
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
/* 12 */
/***/ (function(module, exports) {

module.exports = require("lodash.snakecase");

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var components_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(1);
function computed(target, propertyKey) {
    var descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    if (typeof descriptor.get !== 'function')
        throw new Error("Failed to decorate '" + propertyKey + "'. The 'computed' decorator should only be used on getters.");
    if (descriptor.set)
        throw new Error("Failed to decorate '" + propertyKey + "'. Decorated property should not have a setter.");
    delete target[propertyKey];
    Object.defineProperty(target, propertyKey, utils_1.dataDescriptor);
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
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.dataDescriptor = {
    writable: true,
    configurable: true,
    enumerable: true
};
exports.accessorDescriptor = {
    configurable: true,
    enumerable: true
};
function deferredDefineProperty(target, propertyKey, descriptor) {
    var init = function (isGet) { return function (newVal) {
        Object.defineProperty(this, propertyKey, descriptor);
        if (isGet) {
            return this[propertyKey];
        }
        else {
            this[propertyKey] = newVal;
        }
    }; };
    return Object.defineProperty(target, propertyKey, {
        get: init(true),
        set: init(false),
        enumerable: true,
        configurable: true
    });
}
exports.deferredDefineProperty = deferredDefineProperty;


/***/ }),
/* 15 */
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
/* 16 */
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
/* 17 */
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
        var desc = Object.getOwnPropertyDescriptor(proto, key);
        var hasGetter = desc && typeof desc.get === 'function';
        if (!hasGetter && typeof proto[key] === 'function')
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
function pathString(path) {
    if (path.length) {
        return "root." + path.join('.');
    }
    else {
        return 'root';
    }
}
exports.pathString = pathString;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(19);
var reduxApp_1 = __webpack_require__(3);
var utils_1 = __webpack_require__(1);
var ConnectOptions = (function () {
    function ConnectOptions() {
        this.app = reduxApp_1.DEFAULT_APP_NAME;
        this.live = false;
    }
    return ConnectOptions;
}());
exports.ConnectOptions = ConnectOptions;
function connect(targetOrOptions, propertyKeyOrNothing) {
    if (propertyKeyOrNothing) {
        connectDecorator.call(undefined, targetOrOptions, propertyKeyOrNothing);
    }
    else {
        return function (target, propertyKey) { return connectDecorator(target, propertyKey, targetOrOptions); };
    }
}
exports.connect = connect;
function connectDecorator(target, propertyKey, options) {
    options = Object.assign(new ConnectOptions(), options);
    var value = target[propertyKey];
    var type = Reflect.getMetadata("design:type", target, propertyKey);
    if (!type) {
        var reflectErrMsg = "[connect] Failed to reflect type of property '" + propertyKey + "'. " +
            "Make sure you're using TypeScript and that the 'emitDecoratorMetadata' compiler " +
            "option in your tsconfig.json file is turned on. " +
            "Note that even if TypeScript is configured correctly it may fail to reflect " +
            "property types due to the loading order of your classes. " +
            ("In that case, make sure that the type of '" + propertyKey + "' is loaded prior to the ") +
            ("type of it's containing class (" + target.constructor.name + ").");
        throw new Error(reflectErrMsg);
    }
    var oldDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    var newDescriptor = {
        get: function () {
            var app = reduxApp_1.appsRepository[options.app];
            if (!app) {
                utils_1.log.debug("[connect] Application '" + options.app + "' does not exist. Property " + propertyKey + " is not connected.");
                if (oldDescriptor && oldDescriptor.get) {
                    return oldDescriptor.get();
                }
                else {
                    return value;
                }
            }
            var warehouse = app.getTypeWarehouse(type);
            var result;
            if (options.id) {
                result = warehouse.get(options.id);
            }
            else {
                result = warehouse.values().next().value;
            }
            if (result && !options.live) {
                Object.defineProperty(this, propertyKey, utils_1.dataDescriptor);
                value = this[propertyKey] = result;
                utils_1.log.debug("[connect] Property '" + propertyKey + "' connected. Type: " + type.name + ".");
            }
            return result;
        },
        set: function (newValue) {
            var app = reduxApp_1.appsRepository[options.app];
            if (app) {
                utils_1.log.warn("[connect] Connected component '" + propertyKey + "' value assigned. Component disconnected.");
            }
            if (oldDescriptor && oldDescriptor.set) {
                return oldDescriptor.set(newValue);
            }
            else if (!oldDescriptor || oldDescriptor && oldDescriptor.writable) {
                return value = newValue;
            }
        }
    };
    return utils_1.deferredDefineProperty(target, propertyKey, Object.assign({}, utils_1.accessorDescriptor, newDescriptor));
}


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("reflect-metadata");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),
/* 21 */
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
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var components_1 = __webpack_require__(0);
var symbols_1 = __webpack_require__(4);
var utils_1 = __webpack_require__(1);
function withId(targetOrId, propertyKeyOrNothing) {
    if (propertyKeyOrNothing) {
        withIdDecorator.call(undefined, targetOrId, propertyKeyOrNothing);
    }
    else {
        return function (target, propertyKey) { return withIdDecorator(target, propertyKey, targetOrId); };
    }
}
exports.withId = withId;
function withIdDecorator(target, propertyKey, id) {
    var schema = components_1.Schema.getOrCreateSchema(target);
    schema.childIds[propertyKey] = id || symbols_1.AUTO_ID;
}
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var metadata_1 = __webpack_require__(5);
function isInstanceOf(obj, type) {
    if (obj instanceof type)
        return true;
    var meta = metadata_1.Metadata.getMeta(obj);
    return !!(meta && meta.originalClass === type);
}
exports.isInstanceOf = isInstanceOf;


/***/ })
/******/ ]);
});
//# sourceMappingURL=redux-app.js.map