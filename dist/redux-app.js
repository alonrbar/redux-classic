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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// CONCATENATED MODULE: ./src/symbols.ts
function setSymbol(obj, symbol, value) {
    return obj[symbol] = value;
}
function getSymbol(obj, symbol) {
    return obj[symbol];
}
function getOwnSymbol(obj, symbol) {
    return Object.getOwnPropertySymbols(obj).includes(symbol) && getSymbol(obj, symbol);
}
var COMPONENT_INFO = Symbol('REDUX-APP.COMPONENT_INFO');
var CREATOR_INFO = Symbol('REDUX-APP.CREATOR_INFO');
var CLASS_INFO = Symbol('REDUX-APP.CLASS_INFO');
var AUTO_ID = Symbol('REDUX-APP.AUTO_ID');

// CONCATENATED MODULE: ./src/info/classInfo.ts

var classInfo_ClassInfo = (function () {
    function ClassInfo() {
        this.computedGetters = {};
        this.connectedProps = {};
        this.ignoreState = {};
    }
    ClassInfo.getInfo = function (obj) {
        if (!obj)
            return undefined;
        return getSymbol(obj, CLASS_INFO);
    };
    ClassInfo.getOrInitInfo = function (obj) {
        var info = ClassInfo.getInfo(obj);
        if (!info) {
            info = setSymbol(obj, CLASS_INFO, new ClassInfo());
        }
        return info;
    };
    return ClassInfo;
}());


// CONCATENATED MODULE: ./src/info/componentInfo.ts

var componentInfo_ComponentInfo = (function () {
    function ComponentInfo() {
    }
    ComponentInfo.getInfo = function (component) {
        if (!component)
            return undefined;
        return getSymbol(component, COMPONENT_INFO);
    };
    ComponentInfo.initInfo = function (component) {
        return setSymbol(component, COMPONENT_INFO, new ComponentInfo());
    };
    return ComponentInfo;
}());


// CONCATENATED MODULE: ./src/utils/defineProperty.ts
var dataDescriptor = {
    writable: true,
    configurable: true,
    enumerable: true
};
var accessorDescriptor = {
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

// CONCATENATED MODULE: ./src/options.ts
var snakecase = __webpack_require__(2);
var SchemaOptions = (function () {
    function SchemaOptions() {
        this.actionNamespace = true;
        this.uppercaseActions = true;
    }
    return SchemaOptions;
}());

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
var AppOptions = (function () {
    function AppOptions() {
        this.updateState = true;
    }
    return AppOptions;
}());

var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["None"] = 0] = "None";
    LogLevel[LogLevel["Verbose"] = 1] = "Verbose";
    LogLevel[LogLevel["Debug"] = 2] = "Debug";
    LogLevel[LogLevel["Warn"] = 5] = "Warn";
    LogLevel[LogLevel["Silent"] = 10] = "Silent";
})(LogLevel || (LogLevel = {}));
var GlobalOptions = (function () {
    function GlobalOptions() {
        this.logLevel = LogLevel.Warn;
        this.emitClassNames = false;
        this.convertToPlainObject = true;
        this.schema = new SchemaOptions();
    }
    return GlobalOptions;
}());

var globalOptions = new GlobalOptions();

// CONCATENATED MODULE: ./src/utils/log.ts

var log_Log = (function () {
    function Log() {
    }
    Log.prototype.verbose = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (!this.shouldLog(LogLevel.Verbose))
            return;
        console.debug.apply(console, ['VERBOSE [redux-app] ' + message].concat(optionalParams));
    };
    Log.prototype.debug = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (!this.shouldLog(LogLevel.Debug))
            return;
        console.log.apply(console, ['DEBUG [redux-app] ' + message].concat(optionalParams));
    };
    Log.prototype.warn = function (message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (!this.shouldLog(LogLevel.Warn))
            return;
        console.warn.apply(console, ['WARN [redux-app] ' + message].concat(optionalParams));
    };
    Log.prototype.shouldLog = function (level) {
        if (globalOptions.logLevel === LogLevel.None)
            return false;
        if (globalOptions.logLevel > level)
            return false;
        return true;
    };
    return Log;
}());
var log = new log_Log();

// CONCATENATED MODULE: ./src/utils/simpleCombineReducers.ts
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

// CONCATENATED MODULE: ./src/utils/utils.ts
function isPrimitive(val) {
    if (!val)
        return true;
    var type = typeof val;
    return type !== 'object' && type !== 'function';
}
function getMethods(obj) {
    if (!obj)
        return undefined;
    var proto;
    if (typeof obj === 'object') {
        proto = Object.getPrototypeOf(obj);
    }
    else if (typeof obj === 'function') {
        proto = obj.prototype;
    }
    else {
        throw new Error("Expected an object or a function. Got: " + obj);
    }
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
function getConstructorOwnProp(obj, key) {
    if (!obj || !obj.constructor)
        return undefined;
    var ctor = obj.constructor;
    if (typeof key === 'symbol' && Object.getOwnPropertySymbols(ctor).includes(key)) {
        return ctor[key];
    }
    else if (typeof key === 'string' && Object.getOwnPropertyNames(ctor).includes(key)) {
        return ctor[key];
    }
    return undefined;
}
function getType(obj) {
    if (!obj)
        return undefined;
    if (typeof obj === 'function')
        return obj;
    if (typeof obj === 'object')
        return Object.getPrototypeOf(obj).constructor;
    throw new Error("Expected an object or a function. Got: " + obj);
}
function getParentType(obj) {
    var type = getType(obj);
    return Object.getPrototypeOf(type.prototype).constructor;
}
function toPlainObject(obj) {
    var json = JSON.stringify(obj, function (key, value) { return value === undefined ? null : value; });
    return JSON.parse(json);
}
function clearProperties(obj) {
    var keys = Object.keys(obj);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        delete obj[key];
    }
}

// CONCATENATED MODULE: ./src/utils/index.ts





// CONCATENATED MODULE: ./src/info/creatorInfo.ts


var creatorInfo_CreatorInfo = (function () {
    function CreatorInfo() {
        this.noDispatch = {};
        this.childIds = {};
    }
    CreatorInfo.getInfo = function (obj) {
        if (!obj)
            return undefined;
        if (typeof obj === 'object') {
            return getConstructorOwnProp(obj, CREATOR_INFO);
        }
        else {
            return getOwnSymbol(obj, CREATOR_INFO);
        }
    };
    CreatorInfo.getOrInitInfo = function (obj) {
        var info = CreatorInfo.getInfo(obj);
        if (!info) {
            var isConstructor = (typeof obj === 'function' ? true : false);
            var target = (isConstructor ? obj : obj.constructor);
            var baseInfo = getSymbol(target, CREATOR_INFO);
            var selfInfo = Object.assign(new CreatorInfo(), baseInfo);
            info = setSymbol(target, CREATOR_INFO, selfInfo);
        }
        return info;
    };
    return CreatorInfo;
}());


// CONCATENATED MODULE: ./src/info/creatorMethods.ts


function getCreatorMethods(obj, inherit) {
    if (inherit === void 0) { inherit = true; }
    if (!creatorInfo_CreatorInfo.getInfo(obj))
        return undefined;
    var methods = getMethods(obj);
    if (inherit) {
        var parentType = getParentType(obj);
        while (parentType !== Object) {
            var parentMethods = getCreatorMethods(parentType, false);
            methods = Object.assign({}, parentMethods, methods);
            parentType = getParentType(parentType);
        }
    }
    return methods;
}

// CONCATENATED MODULE: ./src/info/index.ts





// EXTERNAL MODULE: external "redux"
var external__redux_ = __webpack_require__(3);
var external__redux__default = /*#__PURE__*/__webpack_require__.n(external__redux_);

// CONCATENATED MODULE: ./src/reduxApp.ts
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};






var getProp = __webpack_require__(4);
var ROOT_COMPONENT_PATH = 'root';
var DEFAULT_APP_NAME = 'default';
var appsRepository = {};
var appsCount = 0;
var UpdateContext = (function () {
    function UpdateContext(initial) {
        this.visited = new Set();
        this.path = ROOT_COMPONENT_PATH;
        this.forceRecursion = false;
        Object.assign(this, initial);
    }
    return UpdateContext;
}());
var reduxApp_ReduxApp = (function () {
    function ReduxApp(appCreator) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        this.warehouse = new Map();
        this.initialStateUpdate = true;
        var _a = this.resolveParameters(appCreator, params), options = _a.options, preLoadedState = _a.preLoadedState, enhancer = _a.enhancer;
        this.name = this.getAppName(options.name);
        if (appsRepository[this.name])
            throw new Error("An app with name '" + this.name + "' already exists.");
        appsRepository[this.name] = this;
        var initialReducer = function (state) { return state; };
        this.store = Object(external__redux_["createStore"])(initialReducer, preLoadedState, enhancer);
        var creationContext = new component_ComponentCreationContext({ appName: this.name });
        var rootComponent = component_Component.create(this.store, appCreator, creationContext);
        this.root = rootComponent;
        var reducersContext = new reducer_CombineReducersContext({
            componentPaths: Object.keys(creationContext.createdComponents)
        });
        var rootReducer = reducer_ComponentReducer.combineReducersTree(this.root, reducersContext);
        if (options.updateState) {
            var stateListener = this.updateState(creationContext.createdComponents, reducersContext);
            this.subscriptionDisposer = this.store.subscribe(stateListener);
        }
        this.store.replaceReducer(rootReducer);
    }
    ReduxApp.createApp = function (appCreator) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return new (ReduxApp.bind.apply(ReduxApp, [void 0, appCreator].concat(params)))();
    };
    ReduxApp.registerComponent = function (comp, creator, appName) {
        appName = appName || DEFAULT_APP_NAME;
        var app = appsRepository[appName];
        if (app) {
            var warehouse = app.getTypeWarehouse(creator.constructor);
            var key = componentInfo_ComponentInfo.getInfo(comp).id || withId_ComponentId.nextAvailableId();
            warehouse.set(key, comp);
        }
    };
    ReduxApp.prototype.dispose = function () {
        if (this.subscriptionDisposer) {
            this.subscriptionDisposer();
            this.subscriptionDisposer = null;
        }
        if (appsRepository[this.name]) {
            delete appsRepository[this.name];
        }
    };
    ReduxApp.prototype.getTypeWarehouse = function (type) {
        if (!this.warehouse.has(type))
            this.warehouse.set(type, new Map());
        return this.warehouse.get(type);
    };
    ReduxApp.prototype.resolveParameters = function (appCreator, params) {
        var result = {};
        if (params.length === 0) {
            result.options = new AppOptions();
            result.preLoadedState = appCreator;
        }
        else if (params.length === 1) {
            if (typeof params[0] === 'function') {
                result.options = new AppOptions();
                result.enhancer = params[0];
                result.preLoadedState = appCreator;
            }
            else {
                result.options = Object.assign(new AppOptions(), params[0]);
                result.preLoadedState = appCreator;
            }
        }
        else if (params.length === 2) {
            result.options = Object.assign(new AppOptions(), params[0]);
            result.preLoadedState = params[1];
        }
        else {
            result.options = Object.assign(new AppOptions(), params[0]);
            result.preLoadedState = params[1];
            result.enhancer = params[2];
        }
        return result;
    };
    ReduxApp.prototype.getAppName = function (name) {
        if (name)
            return name;
        if (!Object.keys(appsRepository).length) {
            return DEFAULT_APP_NAME;
        }
        else {
            return DEFAULT_APP_NAME + '_' + (++appsCount);
        }
    };
    ReduxApp.prototype.updateState = function (allComponents, reducersContext) {
        var _this = this;
        var withComputedProps = computed_Computed.filterComponents(Object.values(allComponents));
        return function () {
            var start = Date.now();
            var newState = _this.store.getState();
            if (_this.initialStateUpdate || !reducersContext.invoked) {
                _this.initialStateUpdate = false;
                _this.updateStateRecursion(_this.root, newState, new UpdateContext({ forceRecursion: true }));
            }
            else {
                _this.updateChangedComponents((_a = {}, _a[ROOT_COMPONENT_PATH] = newState, _a), reducersContext.changedComponents);
            }
            computed_Computed.computeProps(withComputedProps);
            reducersContext.reset();
            var end = Date.now();
            log.debug("[updateState] Component tree updated in " + (end - start) + "ms.");
            var _a;
        };
    };
    ReduxApp.prototype.updateChangedComponents = function (newState, changedComponents) {
        var changedPaths = Object.keys(changedComponents);
        var updateContext = new UpdateContext();
        for (var _i = 0, changedPaths_1 = changedPaths; _i < changedPaths_1.length; _i++) {
            var path = changedPaths_1[_i];
            var curComponent = changedComponents[path];
            var newSubState = getProp(newState, path);
            this.updateStateRecursion(curComponent, newSubState, __assign({}, updateContext, { path: path }));
        }
    };
    ReduxApp.prototype.updateStateRecursion = function (obj, newState, context) {
        if (obj === newState)
            return newState;
        if (isPrimitive(obj) || isPrimitive(newState))
            return newState;
        if (context.visited.has(obj))
            return obj;
        context.visited.add(obj);
        var newStateType = newState.constructor;
        if (globalOptions.convertToPlainObject)
            newState = toPlainObject(newState);
        if (context.forceRecursion || (obj instanceof component_Component && newStateType === Object)) {
            var changeMessage;
            if (Array.isArray(obj) && Array.isArray(newState)) {
                changeMessage = this.updateArray(obj, newState, context);
            }
            else {
                changeMessage = this.updateObject(obj, newState, context);
            }
        }
        else {
            obj = newState;
            changeMessage = 'Object overwritten.';
        }
        if (changeMessage && changeMessage.length) {
            log.debug("[updateState] Change in '" + context.path + "'. " + changeMessage);
            log.verbose("[updateState] New state: ", obj);
        }
        return obj;
    };
    ReduxApp.prototype.updateObject = function (obj, newState, context) {
        var _this = this;
        var propsDeleted = [];
        Object.keys(obj).forEach(function (key) {
            if (ignoreState_IgnoreState.isIgnoredProperty(obj, key))
                return;
            if (!newState.hasOwnProperty(key)) {
                if (typeof obj[key] === 'function')
                    log.warn("[updateState] Function property removed in path: " + context.path + "." + key + ". Consider using a method instead.");
                delete obj[key];
                propsDeleted.push(key);
            }
        });
        var propsAssigned = [];
        Object.keys(newState).forEach(function (key) {
            if (connect_Connect.isConnectedProperty(obj, key))
                return;
            if (computed_Computed.isComputedProperty(obj, key))
                return;
            if (ignoreState_IgnoreState.isIgnoredProperty(obj, key))
                return;
            var subState = newState[key];
            var subObj = obj[key];
            var newSubObj = _this.updateStateRecursion(subObj, subState, __assign({}, context, { path: context.path + '.' + key }));
            if (newSubObj !== subObj) {
                obj[key] = newSubObj;
                propsAssigned.push(key);
            }
        });
        if (propsAssigned.length || propsDeleted.length) {
            var propsAssignedMessage = propsAssigned.length ? "Props assigned: " + propsAssigned.join(', ') + "." : '';
            var propsDeleteMessage = propsDeleted.length ? "Props deleted: " + propsDeleted.join(', ') + "." : '';
            var space = (propsAssigned.length && propsDeleted.length) ? ' ' : '';
            return propsAssignedMessage + space + propsDeleteMessage;
        }
        else {
            return null;
        }
    };
    ReduxApp.prototype.updateArray = function (arr, newState, context) {
        var changeMessage = [];
        var prevLength = arr.length;
        var newLength = newState.length;
        var itemsAssigned = [];
        for (var i = 0; i < Math.min(prevLength, newLength); i++) {
            var subState = newState[i];
            var subObj = arr[i];
            var newSubObj = this.updateStateRecursion(subObj, subState, __assign({}, context, { path: context.path + '.' + i }));
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
    ReduxApp.options = globalOptions;
    return ReduxApp;
}());


// CONCATENATED MODULE: ./src/decorators/connect/connectOptions.ts

var connectOptions_ConnectOptions = (function () {
    function ConnectOptions() {
        this.app = DEFAULT_APP_NAME;
        this.live = false;
    }
    return ConnectOptions;
}());


// CONCATENATED MODULE: ./src/decorators/connect/connect.ts

var connect_Connect = (function () {
    function Connect() {
    }
    Connect.isConnectedProperty = function (propHolder, propKey) {
        var info = classInfo_ClassInfo.getInfo(propHolder);
        return info && info.connectedProps[propKey];
    };
    Connect.setupConnectedProps = function (target, targetInfo, source, sourceInfo) {
        if (!sourceInfo)
            return;
        for (var _i = 0, _a = Object.keys(sourceInfo.connectedProps); _i < _a.length; _i++) {
            var propKey = _a[_i];
            source[propKey];
            var desc = Object.getOwnPropertyDescriptor(source, propKey);
            Object.defineProperty(target, propKey, desc);
        }
        targetInfo.connectedProps = sourceInfo.connectedProps;
    };
    Connect.removeConnectedProps = function (state, obj, connectedProps) {
        var info = classInfo_ClassInfo.getInfo(obj);
        if (!info)
            return state;
        Object.assign(connectedProps, info.connectedProps);
        var newState = Object.assign({}, state);
        for (var _i = 0, _a = Object.keys(info.connectedProps); _i < _a.length; _i++) {
            var propKey = _a[_i];
            var sourceInfoString = '';
            var sourceInfo = componentInfo_ComponentInfo.getInfo(obj[propKey]);
            if (sourceInfo) {
                var sourceIdString = (sourceInfo.id !== undefined ? '.' + sourceInfo.id : '');
                sourceInfoString = '.' + sourceInfo.originalClass.name + sourceIdString;
            }
            newState[propKey] = Connect.placeholderPrefix + sourceInfoString + '>';
        }
        return newState;
    };
    Connect.placeholderPrefix = '<connected';
    return Connect;
}());


// EXTERNAL MODULE: external "reflect-metadata"
var external__reflect_metadata_ = __webpack_require__(5);
var external__reflect_metadata__default = /*#__PURE__*/__webpack_require__.n(external__reflect_metadata_);

// CONCATENATED MODULE: ./src/decorators/connect/decorator.ts





function connect(targetOrOptions, propertyKeyOrNothing) {
    if (propertyKeyOrNothing) {
        connectDecorator.call(undefined, targetOrOptions, propertyKeyOrNothing);
    }
    else {
        return function (target, propertyKey) { return connectDecorator(target, propertyKey, targetOrOptions); };
    }
}
function connectDecorator(target, propertyKey, options) {
    options = Object.assign(new connectOptions_ConnectOptions(), options);
    var value = target[propertyKey];
    var info = classInfo_ClassInfo.getOrInitInfo(target);
    info.connectedProps[propertyKey] = true;
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
            var app = appsRepository[options.app];
            if (!app) {
                log.debug("[connect] Application '" + options.app + "' does not exist. Property " + propertyKey + " is not connected.");
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
                Object.defineProperty(this, propertyKey, dataDescriptor);
                value = this[propertyKey] = result;
                log.verbose("[connect] Property '" + propertyKey + "' connected. Type: " + type.name + ".");
            }
            return result;
        },
        set: function (newValue) {
            var app = appsRepository[options.app];
            if (app) {
                log.warn("[connect] Connected component '" + propertyKey + "' value assigned. Component disconnected.");
            }
            if (oldDescriptor && oldDescriptor.set) {
                return oldDescriptor.set(newValue);
            }
            else if (!oldDescriptor || oldDescriptor && oldDescriptor.writable) {
                return value = newValue;
            }
        }
    };
    return deferredDefineProperty(target, propertyKey, Object.assign({}, accessorDescriptor, newDescriptor));
}

// CONCATENATED MODULE: ./src/decorators/connect/index.ts




// CONCATENATED MODULE: ./src/decorators/component.ts


function component_component(ctorOrOptions) {
    if (typeof ctorOrOptions === 'function') {
        componentDecorator.call(undefined, ctorOrOptions);
    }
    else {
        return function (ctor) { return componentDecorator(ctor, ctorOrOptions); };
    }
}
function componentDecorator(ctor, options) {
    var info = creatorInfo_CreatorInfo.getOrInitInfo(ctor);
    info.options = Object.assign({}, options, new SchemaOptions(), globalOptions.schema);
}

// CONCATENATED MODULE: ./src/decorators/computed.ts


function computed(target, propertyKey) {
    var descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    if (typeof descriptor.get !== 'function')
        throw new Error("Failed to decorate '" + propertyKey + "'. The 'computed' decorator should only be used on getters.");
    if (descriptor.set)
        throw new Error("Failed to decorate '" + propertyKey + "'. Decorated property should not have a setter.");
    var info = classInfo_ClassInfo.getOrInitInfo(target);
    info.computedGetters[propertyKey] = descriptor.get;
    return deferredDefineProperty(target, propertyKey, dataDescriptor);
}
var computed_Computed = (function () {
    function Computed() {
    }
    Computed.isComputedProperty = function (propHolder, propKey) {
        var info = classInfo_ClassInfo.getInfo(propHolder);
        return info && (typeof info.computedGetters[propKey] === 'function');
    };
    Computed.removeComputedProps = function (state, obj, computedProps) {
        var info = classInfo_ClassInfo.getInfo(obj);
        if (!info)
            return state;
        Object.assign(computedProps, info.computedGetters);
        var newState = Object.assign({}, state);
        for (var _i = 0, _a = Object.keys(info.computedGetters); _i < _a.length; _i++) {
            var propKey = _a[_i];
            newState[propKey] = Computed.placeholder;
        }
        return newState;
    };
    Computed.filterComponents = function (components) {
        return components.filter(function (comp) {
            var info = classInfo_ClassInfo.getInfo(comp);
            return info && Object.keys(info.computedGetters);
        });
    };
    Computed.computeProps = function (components) {
        for (var _i = 0, components_1 = components; _i < components_1.length; _i++) {
            var comp = components_1[_i];
            this.computeObjectProps(comp);
        }
    };
    Computed.computeObjectProps = function (obj) {
        var info = classInfo_ClassInfo.getInfo(obj);
        if (!info)
            return;
        for (var _i = 0, _a = Object.keys(info.computedGetters); _i < _a.length; _i++) {
            var propKey = _a[_i];
            var getter = info.computedGetters[propKey];
            var newValue = getter.call(obj);
            var oldValue = obj[propKey];
            if (newValue !== oldValue) {
                obj[propKey] = newValue;
            }
        }
    };
    Computed.placeholder = '<computed>';
    return Computed;
}());


// CONCATENATED MODULE: ./src/decorators/ignoreState.ts

function ignoreState(target, propertyKey) {
    var info = classInfo_ClassInfo.getOrInitInfo(target);
    info.ignoreState[propertyKey] = true;
}
var ignoreState_IgnoreState = (function () {
    function IgnoreState() {
    }
    IgnoreState.isIgnoredProperty = function (propHolder, propKey) {
        var info = classInfo_ClassInfo.getInfo(propHolder);
        return info && info.ignoreState[propKey];
    };
    IgnoreState.removeIgnoredProps = function (state, obj, ignoredProps) {
        var info = classInfo_ClassInfo.getInfo(obj);
        if (!info)
            return state;
        Object.assign(ignoredProps, info.ignoreState);
        var newState = Object.assign({}, state);
        for (var _i = 0, _a = Object.keys(info.ignoreState); _i < _a.length; _i++) {
            var propKey = _a[_i];
            delete newState[propKey];
        }
        return newState;
    };
    return IgnoreState;
}());


// CONCATENATED MODULE: ./src/decorators/noDispatch.ts

function noDispatch(target, propertyKey) {
    noDispatchDecorator(target, propertyKey);
}
function sequence(target, propertyKey) {
    noDispatchDecorator(target, propertyKey);
}
function noDispatchDecorator(target, propertyKey) {
    var info = creatorInfo_CreatorInfo.getOrInitInfo(target);
    info.noDispatch[propertyKey] = true;
}

// CONCATENATED MODULE: ./src/decorators/withId.ts



function withId(targetOrId, propertyKeyOrNothing) {
    if (propertyKeyOrNothing) {
        withIdDecorator.call(undefined, targetOrId, propertyKeyOrNothing);
    }
    else {
        return function (target, propertyKey) { return withIdDecorator(target, propertyKey, targetOrId); };
    }
}
function withIdDecorator(target, propertyKey, id) {
    var info = creatorInfo_CreatorInfo.getOrInitInfo(target);
    info.childIds[propertyKey] = id || AUTO_ID;
}
var withId_ComponentId = (function () {
    function ComponentId() {
    }
    ComponentId.nextAvailableId = function () {
        return --ComponentId.autoComponentId;
    };
    ComponentId.getComponentId = function (parentCreator, path) {
        var pathArray = path.split('.');
        if (!parentCreator || !pathArray.length)
            return undefined;
        var info = creatorInfo_CreatorInfo.getInfo(parentCreator);
        if (!info)
            return;
        var selfKey = pathArray[pathArray.length - 1];
        var id = info.childIds[selfKey];
        if (!id)
            return undefined;
        if (id === AUTO_ID) {
            var generatedId = ComponentId.nextAvailableId();
            log.verbose('[getComponentId] new component id generated: ' + generatedId);
            info.childIds[selfKey] = generatedId;
            return generatedId;
        }
        return id;
    };
    ComponentId.autoComponentId = 0;
    return ComponentId;
}());


// CONCATENATED MODULE: ./src/decorators/index.ts







// CONCATENATED MODULE: ./src/components/reducer.ts
var reducer___assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};





var reducer_CombineReducersContext = (function () {
    function CombineReducersContext(initial) {
        this.visited = new Set();
        this.path = ROOT_COMPONENT_PATH;
        this.componentPaths = [];
        this.changedComponents = {};
        this.invoked = false;
        Object.assign(this, initial);
    }
    CombineReducersContext.prototype.reset = function () {
        clearProperties(this.changedComponents);
        this.invoked = false;
    };
    return CombineReducersContext;
}());

var reducer_ComponentReducer = (function () {
    function ComponentReducer() {
    }
    ComponentReducer.createReducer = function (component, componentCreator) {
        var methods = getCreatorMethods(componentCreator);
        var creatorInfo = creatorInfo_CreatorInfo.getInfo(componentCreator);
        if (!creatorInfo)
            throw new Error("Inconsistent component '" + componentCreator.constructor.name + "'. The 'component' class decorator is missing.");
        var options = creatorInfo.options;
        var methodNames = {};
        Object.keys(methods).forEach(function (methName) {
            var actionName = getActionName(componentCreator, methName, options);
            methodNames[actionName] = methName;
        });
        var stateProto = ComponentReducer.createStateObjectPrototype(component, creatorInfo);
        var componentId = componentInfo_ComponentInfo.getInfo(component).id;
        return function (changeListener) {
            return function (state, action) {
                log.verbose("[reducer] Reducer of: " + componentCreator.constructor.name + ", action: " + action.type);
                if (state === undefined) {
                    log.verbose('[reducer] State is undefined, returning initial value');
                    return component;
                }
                if (componentId !== action.id) {
                    log.verbose("[reducer] Component id and action.id don't match (" + componentId + " !== " + action.id + ")");
                    return state;
                }
                var methodName = methodNames[action.type];
                var actionReducer = methods[methodName];
                if (!actionReducer) {
                    log.verbose('[reducer] No matching action in this reducer, returning previous state');
                    return state;
                }
                var newState = ComponentReducer.createStateObject(state, stateProto);
                actionReducer.call.apply(actionReducer, [newState].concat(action.payload));
                changeListener(component);
                log.verbose('[reducer] Reducer invoked, returning new state');
                return newState;
            };
        };
    };
    ComponentReducer.combineReducersTree = function (root, context) {
        var reducer = ComponentReducer.combineReducersRecursion(root, context);
        return function (state, action) {
            var start = Date.now();
            context.invoked = true;
            var newState = reducer(state, action);
            newState = ComponentReducer.finalizeState(newState, root);
            var end = Date.now();
            log.debug("[rootReducer] Reducer tree processed in " + (end - start) + "ms.");
            return newState;
        };
    };
    ComponentReducer.createStateObject = function (state, stateProto) {
        var stateObj = Object.create(stateProto);
        Object.assign(stateObj, state);
        return stateObj;
    };
    ComponentReducer.createStateObjectPrototype = function (component, creatorInfo) {
        var stateProto = {};
        var componentMethods = getMethods(component);
        for (var _i = 0, _a = Object.keys(componentMethods); _i < _a.length; _i++) {
            var key = _a[_i];
            if (creatorInfo.noDispatch[key]) {
                stateProto[key] = componentMethods[key].bind(component);
            }
            else {
                stateProto[key] = ComponentReducer.actionInvokedError;
            }
        }
        return stateProto;
    };
    ComponentReducer.actionInvokedError = function () {
        throw new Error("Only 'noDispatch' methods can be invoked inside actions.");
    };
    ComponentReducer.combineReducersRecursion = function (obj, context) {
        if (isPrimitive(obj))
            return undefined;
        if (context.visited.has(obj))
            return undefined;
        context.visited.add(obj);
        if (!context.componentPaths.some(function (path) { return path.startsWith(context.path); }))
            return ComponentReducer.identityReducer;
        var rootReducer;
        var info = componentInfo_ComponentInfo.getInfo(obj);
        if (info) {
            rootReducer = info.reducerCreator(function (comp) {
                context.changedComponents[context.path] = comp;
            });
        }
        else {
            rootReducer = ComponentReducer.identityReducer;
        }
        var subReducers = {};
        for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
            var key = _a[_i];
            if (connect_Connect.isConnectedProperty(obj, key))
                continue;
            var newSubReducer = ComponentReducer.combineReducersRecursion(obj[key], new reducer_CombineReducersContext(reducer___assign({}, context, { path: (context.path === '' ? key : context.path + '.' + key) })));
            if (typeof newSubReducer === 'function')
                subReducers[key] = newSubReducer;
        }
        var resultReducer = rootReducer;
        if (Object.keys(subReducers).length) {
            var combinedSubReducer = simpleCombineReducers(subReducers);
            resultReducer = function (state, action) {
                var thisState = rootReducer(state, action);
                var subStates = combinedSubReducer(thisState, action);
                var combinedState = ComponentReducer.mergeState(thisState, subStates);
                return combinedState;
            };
        }
        return resultReducer;
    };
    ComponentReducer.mergeState = function (state, subStates) {
        if (Array.isArray(state) && Array.isArray(subStates)) {
            for (var i = 0; i < subStates.length; i++)
                state[i] = subStates[i];
            return state;
        }
        else {
            return reducer___assign({}, state, subStates);
        }
    };
    ComponentReducer.finalizeState = function (rootState, root) {
        return ComponentReducer.finalizeStateRecursion(rootState, root, new Set());
    };
    ComponentReducer.finalizeStateRecursion = function (state, obj, visited) {
        if (isPrimitive(state) || isPrimitive(obj))
            return state;
        if (visited.has(state))
            return state;
        visited.add(state);
        var handledProps = {};
        state = connect_Connect.removeConnectedProps(state, obj, handledProps);
        state = computed_Computed.removeComputedProps(state, obj, handledProps);
        state = ignoreState_IgnoreState.removeIgnoredProps(state, obj, handledProps);
        Object.keys(state).forEach(function (key) {
            if (handledProps.hasOwnProperty(key))
                return;
            var subState = state[key];
            var subObj = obj[key];
            var newSubState = ComponentReducer.finalizeStateRecursion(subState, subObj, visited);
            if (newSubState !== subState) {
                state[key] = newSubState;
            }
        });
        return state;
    };
    ComponentReducer.identityReducer = function (state) { return state; };
    return ComponentReducer;
}());


// CONCATENATED MODULE: ./src/components/component.ts
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
var component___assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};







var component_ComponentCreationContext = (function () {
    function ComponentCreationContext(initial) {
        this.visited = new Set();
        this.path = ROOT_COMPONENT_PATH;
        this.createdComponents = {};
        Object.assign(this, initial);
    }
    return ComponentCreationContext;
}());

var component_Component = (function () {
    function Component(store, creator, context) {
        if (!creatorInfo_CreatorInfo.getInfo(creator))
            throw new Error("Argument '" + "creator" + "' is not a component creator. Did you forget to use the decorator?");
        Component.createSelf(this, store, creator, context);
        Component.createSubComponents(this, store, creator, context);
        context.createdComponents[context.path] = this;
        log.verbose("[Component] New " + creator.constructor.name + " component created. Path: " + context.path);
    }
    Component.create = function (store, creator, context) {
        context = Object.assign(new component_ComponentCreationContext(), context);
        var ComponentClass = Component.getComponentClass(creator);
        var component = new ComponentClass(store, creator, context);
        reduxApp_ReduxApp.registerComponent(component, creator, context.appName);
        return component;
    };
    Component.getComponentClass = function (creator) {
        var info = creatorInfo_CreatorInfo.getInfo(creator);
        if (!info.componentClass) {
            info.componentClass = Component.createComponentClass(creator);
            info.originalClass = creator.constructor;
        }
        return info.componentClass;
    };
    Component.createComponentClass = function (creator) {
        var ComponentClass = (function (_super) {
            __extends(ComponentClass, _super);
            function ComponentClass(store, creatorArg, context) {
                var _this = _super.call(this, store, creatorArg, context) || this;
                _this.__originalClassName__ = creator.constructor.name;
                if (!globalOptions.emitClassNames)
                    delete _this.__originalClassName__;
                return _this;
            }
            return ComponentClass;
        }(Component));
        var actions = actions_ComponentActions.createActions(creator);
        Object.assign(ComponentClass.prototype, actions);
        return ComponentClass;
    };
    Component.createSelf = function (component, store, creator, context) {
        for (var _i = 0, _a = Object.getOwnPropertyNames(creator); _i < _a.length; _i++) {
            var key = _a[_i];
            var desc = Object.getOwnPropertyDescriptor(creator, key);
            Object.defineProperty(component, key, desc);
        }
        var selfInfo = componentInfo_ComponentInfo.initInfo(component);
        var selfClassInfo = classInfo_ClassInfo.getOrInitInfo(component);
        var creatorInfo = creatorInfo_CreatorInfo.getInfo(creator);
        var creatorClassInfo = classInfo_ClassInfo.getInfo(creator) || new classInfo_ClassInfo();
        selfInfo.id = withId_ComponentId.getComponentId(context.parentCreator, context.path);
        selfInfo.originalClass = creatorInfo.originalClass;
        selfClassInfo.computedGetters = creatorClassInfo.computedGetters;
        selfClassInfo.ignoreState = creatorClassInfo.ignoreState;
        connect_Connect.setupConnectedProps(component, selfClassInfo, creator, creatorClassInfo);
        selfInfo.dispatch = store.dispatch;
        selfInfo.reducerCreator = reducer_ComponentReducer.createReducer(component, creator);
    };
    Component.createSubComponents = function (obj, store, creator, context) {
        if (isPrimitive(obj))
            return;
        if (context.visited.has(obj))
            return;
        context.visited.add(obj);
        var searchIn = creator || obj;
        for (var _i = 0, _a = Object.keys(searchIn); _i < _a.length; _i++) {
            var key = _a[_i];
            var connectionInfo = connect_Connect.isConnectedProperty(obj, key);
            if (connectionInfo)
                continue;
            var subPath = context.path + '.' + key;
            var subCreator = searchIn[key];
            if (creatorInfo_CreatorInfo.getInfo(subCreator)) {
                obj[key] = Component.create(store, subCreator, component___assign({}, context, { parentCreator: creator, path: subPath }));
            }
            else {
                Component.createSubComponents(obj[key], store, null, component___assign({}, context, { parentCreator: null, path: subPath }));
            }
        }
    };
    return Component;
}());


// CONCATENATED MODULE: ./src/components/actions.ts



var actions_ComponentActions = (function () {
    function ComponentActions() {
    }
    ComponentActions.createActions = function (creator) {
        var methods = getCreatorMethods(creator);
        if (!methods)
            return undefined;
        var creatorInfo = creatorInfo_CreatorInfo.getInfo(creator);
        var componentActions = {};
        Object.keys(methods).forEach(function (key) {
            componentActions[key] = function () {
                var payload = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    payload[_i] = arguments[_i];
                }
                if (!(this instanceof component_Component))
                    throw new Error("Component method invoked with non-Component as 'this'. Bound 'this' argument is: " + this);
                var oldMethod = methods[key];
                if (creatorInfo.noDispatch[key]) {
                    return oldMethod.call.apply(oldMethod, [this].concat(payload));
                }
                else {
                    var compInfo = componentInfo_ComponentInfo.getInfo(this);
                    var action = {
                        type: getActionName(creator, key, creatorInfo.options),
                        id: (compInfo ? compInfo.id : undefined),
                        payload: payload
                    };
                    compInfo.dispatch(action);
                }
            };
        });
        return componentActions;
    };
    return ComponentActions;
}());


// CONCATENATED MODULE: ./src/components/utils.ts

function isInstanceOf(obj, type) {
    if (obj instanceof type)
        return true;
    var info = componentInfo_ComponentInfo.getInfo(obj);
    return !!(info && info.originalClass === type);
}

// CONCATENATED MODULE: ./src/components/index.ts





// CONCATENATED MODULE: ./src/index.ts
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "isInstanceOf", function() { return isInstanceOf; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "component", function() { return component_component; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "connect", function() { return connect; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "computed", function() { return computed; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ignoreState", function() { return ignoreState; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "noDispatch", function() { return noDispatch; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "sequence", function() { return sequence; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "withId", function() { return withId; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "SchemaOptions", function() { return SchemaOptions; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "AppOptions", function() { return AppOptions; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "GlobalOptions", function() { return GlobalOptions; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "LogLevel", function() { return LogLevel; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "ReduxApp", function() { return reduxApp_ReduxApp; });






/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("lodash.snakecase");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("lodash.get");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("reflect-metadata");

/***/ })
/******/ ]);
});
//# sourceMappingURL=redux-app.js.map