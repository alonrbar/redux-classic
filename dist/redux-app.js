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
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
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
__export(__webpack_require__(13));
__export(__webpack_require__(14));
__export(__webpack_require__(15));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(16));
__export(__webpack_require__(17));
__export(__webpack_require__(19));
__export(__webpack_require__(20));


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var snakecase = __webpack_require__(18);
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
function setSymbol(obj, symbol, value) {
    return obj[symbol] = value;
}
exports.setSymbol = setSymbol;
function getSymbol(obj, symbol) {
    return obj[symbol];
}
exports.getSymbol = getSymbol;
exports.COMPONENT_INFO = Symbol('REDUX-APP.COMPONENT_INFO');
exports.CREATOR_INFO = Symbol('REDUX-APP.CREATOR_INFO');
exports.CLASS_INFO = Symbol('REDUX-APP.CLASS_INFO');
exports.AUTO_ID = Symbol('REDUX-APP.AUTO_ID');


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(21));
__export(__webpack_require__(26));
__export(__webpack_require__(27));
__export(__webpack_require__(28));
__export(__webpack_require__(29));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = __webpack_require__(22);
var components_1 = __webpack_require__(6);
var decorators_1 = __webpack_require__(4);
var info_1 = __webpack_require__(0);
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
        var _a = this.resolveParameters(appCreator, params), options = _a.options, preLoadedState = _a.preLoadedState, enhancer = _a.enhancer;
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
        var actualReducer = components_1.ComponentReducer.combineReducersTree(rootComponent);
        this.store.replaceReducer(actualReducer);
    }
    ReduxApp.createApp = function (appCreator) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return new (ReduxApp.bind.apply(ReduxApp, [void 0, appCreator].concat(params)))();
    };
    ReduxApp.registerComponent = function (comp, creator, path) {
        var appName = path[0] || exports.DEFAULT_APP_NAME;
        var app = exports.appsRepository[appName];
        if (app) {
            var warehouse = app.getTypeWarehouse(creator.constructor);
            var key = info_1.ComponentInfo.getInfo(comp).id || decorators_1.ComponentId.nextAvailableId();
            warehouse.set(key, comp);
        }
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
    ReduxApp.prototype.resolveParameters = function (appCreator, params) {
        var result = {};
        if (params.length === 0) {
            result.options = new options_1.AppOptions();
            result.preLoadedState = appCreator;
        }
        else if (params.length === 1) {
            if (typeof params[0] === 'function') {
                result.options = new options_1.AppOptions();
                result.enhancer = params[0];
                result.preLoadedState = appCreator;
            }
            else {
                result.options = Object.assign(new options_1.AppOptions(), params[0]);
                result.preLoadedState = appCreator;
            }
        }
        else if (params.length === 2) {
            result.options = Object.assign(new options_1.AppOptions(), params[0]);
            result.preLoadedState = params[1];
        }
        else {
            result.options = Object.assign(new options_1.AppOptions(), params[0]);
            result.preLoadedState = params[1];
            result.enhancer = params[2];
        }
        return result;
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
        var start = Date.now();
        var newState = this.store.getState();
        utils_1.log.verbose('[updateState] Store before: ', newState);
        var visited = new Set();
        this.updateStateRecursion(this.root, newState, [this.name], visited);
        var end = Date.now();
        utils_1.log.debug("[updateState] Component tree updated in " + (end - start) + "ms.");
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
            if (decorators_1.Connect.isConnectedProperty(obj, key))
                return;
            var subState = newState[key];
            var subObj = obj[key];
            var newSubObj = _this.updateStateRecursion(subObj, subState, path.concat(key), visited);
            if (newSubObj !== subObj) {
                obj[key] = newSubObj;
                propsAssigned.push(key);
            }
        });
        decorators_1.Computed.computeProps(obj);
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
    ReduxApp.options = options_1.globalOptions;
    return ReduxApp;
}());
exports.ReduxApp = ReduxApp;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(7));
__export(__webpack_require__(8));
__export(__webpack_require__(10));
__export(__webpack_require__(30));


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var info_1 = __webpack_require__(0);
var options_1 = __webpack_require__(2);
var utils_1 = __webpack_require__(1);
var component_1 = __webpack_require__(8);
var ComponentActions = (function () {
    function ComponentActions() {
    }
    ComponentActions.createActions = function (creator) {
        var methods = utils_1.getMethods(creator);
        if (!methods)
            return undefined;
        var creatorInfo = info_1.CreatorInfo.getInfo(creator);
        var componentActions = {};
        Object.keys(methods).forEach(function (key) {
            componentActions[key] = function () {
                var payload = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    payload[_i] = arguments[_i];
                }
                if (!(this instanceof component_1.Component))
                    throw new Error("Component method invoked with non-Component as 'this'. Bound 'this' argument is: " + this);
                var oldMethod = methods[key];
                if (creatorInfo.noDispatch[key]) {
                    oldMethod.call.apply(oldMethod, [this].concat(payload));
                }
                else {
                    var compInfo = info_1.ComponentInfo.getInfo(this);
                    var action = {
                        type: options_1.getActionName(creator, key, creatorInfo.options),
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
exports.ComponentActions = ComponentActions;


/***/ }),
/* 8 */
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
var decorators_1 = __webpack_require__(4);
var info_1 = __webpack_require__(0);
var options_1 = __webpack_require__(2);
var reduxApp_1 = __webpack_require__(5);
var utils_1 = __webpack_require__(1);
var actions_1 = __webpack_require__(7);
var reducer_1 = __webpack_require__(10);
var Component = (function () {
    function Component(store, creator, parentCreator, path, visited) {
        if (path === void 0) { path = []; }
        if (visited === void 0) { visited = new Set(); }
        if (!info_1.CreatorInfo.getInfo(creator))
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
        reduxApp_1.ReduxApp.registerComponent(component, creator, path);
        return component;
    };
    Component.getComponentClass = function (creator) {
        var info = info_1.CreatorInfo.getInfo(creator);
        if (!info.componentClass) {
            info.componentClass = Component.createComponentClass(creator);
            info.originalClass = creator.constructor;
        }
        return info.componentClass;
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
        var actions = actions_1.ComponentActions.createActions(creator);
        Object.assign(ComponentClass.prototype, actions);
        return ComponentClass;
    };
    Component.createSelf = function (component, store, creator, parentCreator, path) {
        for (var _i = 0, _a = Object.getOwnPropertyNames(creator); _i < _a.length; _i++) {
            var key = _a[_i];
            var desc = Object.getOwnPropertyDescriptor(creator, key);
            Object.defineProperty(component, key, desc);
        }
        var selfInfo = info_1.ComponentInfo.initInfo(component);
        var selfClassInfo = info_1.ClassInfo.getOrInitInfo(component);
        var creatorInfo = info_1.CreatorInfo.getInfo(creator);
        var creatorClassInfo = info_1.ClassInfo.getInfo(creator) || new info_1.ClassInfo();
        selfInfo.id = decorators_1.ComponentId.getComponentId(parentCreator, path);
        selfInfo.originalClass = creatorInfo.originalClass;
        selfClassInfo.computedGetters = creatorClassInfo.computedGetters;
        decorators_1.Connect.setupConnectedProps(component, selfClassInfo, creator, creatorClassInfo);
        selfInfo.dispatch = store.dispatch;
        selfInfo.reducer = reducer_1.ComponentReducer.createReducer(component, creator);
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
            var connectionInfo = decorators_1.Connect.isConnectedProperty(obj, key);
            if (connectionInfo) {
                utils_1.log.verbose("[createSubComponents] Property in path '" + utils_1.pathString(path) + "." + key + "' is connected. Skipping component creation.");
                continue;
            }
            var subPath = path.concat([key]);
            var subCreator = searchIn[key];
            if (info_1.CreatorInfo.getInfo(subCreator)) {
                obj[key] = Component.create(store, subCreator, creator, subPath, visited);
            }
            else {
                Component.createSubComponents(obj[key], store, null, subPath, visited);
            }
        }
    };
    return Component;
}());
exports.Component = Component;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var reduxApp_1 = __webpack_require__(5);
var ConnectOptions = (function () {
    function ConnectOptions() {
        this.app = reduxApp_1.DEFAULT_APP_NAME;
        this.live = false;
    }
    return ConnectOptions;
}());
exports.ConnectOptions = ConnectOptions;


/***/ }),
/* 10 */
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
var decorators_1 = __webpack_require__(4);
var info_1 = __webpack_require__(0);
var options_1 = __webpack_require__(2);
var utils_1 = __webpack_require__(1);
var ComponentReducer = (function () {
    function ComponentReducer() {
    }
    ComponentReducer.createReducer = function (component, creator) {
        var methods = utils_1.getMethods(creator);
        var options = info_1.CreatorInfo.getInfo(creator).options;
        var methodNames = {};
        Object.keys(methods).forEach(function (methName) {
            var actionName = options_1.getActionName(creator, methName, options);
            methodNames[actionName] = methName;
        });
        var componentId = info_1.ComponentInfo.getInfo(component).id;
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
    ComponentReducer.combineReducersTree = function (root) {
        var reducer = ComponentReducer.combineReducersRecursion(root, new Set());
        return function (state, action) {
            var start = Date.now();
            var newState = reducer(state, action);
            newState = ComponentReducer.finalizeState(newState, root);
            var end = Date.now();
            utils_1.log.debug("[rootReducer] Reducer tree processed in " + (end - start) + "ms.");
            return newState;
        };
    };
    ComponentReducer.combineReducersRecursion = function (obj, visited) {
        if (utils_1.isPrimitive(obj))
            return undefined;
        if (visited.has(obj))
            return undefined;
        visited.add(obj);
        var rootReducer;
        var info = info_1.ComponentInfo.getInfo(obj);
        if (info) {
            rootReducer = info.reducer;
        }
        else {
            rootReducer = ComponentReducer.identityReducer;
        }
        var subReducers = {};
        for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
            var key = _a[_i];
            if (decorators_1.Connect.isConnectedProperty(obj, key))
                continue;
            var newSubReducer = ComponentReducer.combineReducersRecursion(obj[key], visited);
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
        return resultReducer;
    };
    ComponentReducer.finalizeState = function (rootState, root) {
        return ComponentReducer.transformDeep(rootState, root, function (subState, subObj) {
            var newSubState = decorators_1.Computed.removeComputedProps(subState, subObj);
            newSubState = decorators_1.Connect.removeConnectedProps(newSubState, subObj);
            return newSubState;
        }, new Set());
    };
    ComponentReducer.transformDeep = function (target, source, callback, visited) {
        if (utils_1.isPrimitive(target) || utils_1.isPrimitive(source))
            return target;
        if (visited.has(source))
            return source;
        visited.add(source);
        Object.keys(target).forEach(function (key) {
            if (decorators_1.Connect.isConnectedProperty(source, key))
                return;
            var subState = target[key];
            var subObj = source[key];
            var newSubState = ComponentReducer.transformDeep(subState, subObj, callback, visited);
            if (newSubState !== subState) {
                target[key] = newSubState;
            }
        });
        return callback(target, source);
    };
    ComponentReducer.identityReducer = function (state) { return state; };
    return ComponentReducer;
}());
exports.ComponentReducer = ComponentReducer;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(12);


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var components_1 = __webpack_require__(6);
exports.isInstanceOf = components_1.isInstanceOf;
var decorators_1 = __webpack_require__(4);
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
var reduxApp_1 = __webpack_require__(5);
exports.ReduxApp = reduxApp_1.ReduxApp;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var symbols_1 = __webpack_require__(3);
var ClassInfo = (function () {
    function ClassInfo() {
        this.computedGetters = {};
        this.connectedProps = {};
    }
    ClassInfo.getInfo = function (obj) {
        if (!obj)
            return undefined;
        return symbols_1.getSymbol(obj, symbols_1.CLASS_INFO);
    };
    ClassInfo.getOrInitInfo = function (obj) {
        var info = ClassInfo.getInfo(obj);
        if (!info) {
            info = symbols_1.setSymbol(obj, symbols_1.CLASS_INFO, new ClassInfo());
        }
        return info;
    };
    return ClassInfo;
}());
exports.ClassInfo = ClassInfo;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var symbols_1 = __webpack_require__(3);
var ComponentInfo = (function () {
    function ComponentInfo() {
    }
    ComponentInfo.getInfo = function (component) {
        if (!component)
            return undefined;
        return symbols_1.getSymbol(component, symbols_1.COMPONENT_INFO);
    };
    ComponentInfo.initInfo = function (component) {
        return symbols_1.setSymbol(component, symbols_1.COMPONENT_INFO, new ComponentInfo());
    };
    return ComponentInfo;
}());
exports.ComponentInfo = ComponentInfo;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var symbols_1 = __webpack_require__(3);
var utils_1 = __webpack_require__(1);
var CreatorInfo = (function () {
    function CreatorInfo() {
        this.noDispatch = {};
        this.childIds = {};
    }
    CreatorInfo.getInfo = function (obj) {
        if (!obj)
            return undefined;
        if (typeof obj === 'object') {
            return utils_1.getConstructorProp(obj, symbols_1.CREATOR_INFO);
        }
        else {
            return symbols_1.getSymbol(obj, symbols_1.CREATOR_INFO);
        }
    };
    CreatorInfo.getOrInitInfo = function (obj) {
        var info = CreatorInfo.getInfo(obj);
        if (!info) {
            var isConstructor = (typeof obj === 'function' ? true : false);
            var target = (isConstructor ? obj : obj.constructor);
            info = symbols_1.setSymbol(target, symbols_1.CREATOR_INFO, new CreatorInfo());
        }
        return info;
    };
    return CreatorInfo;
}());
exports.CreatorInfo = CreatorInfo;


/***/ }),
/* 16 */
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
/* 17 */
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
/* 18 */
/***/ (function(module, exports) {

module.exports = require("lodash.snakecase");

/***/ }),
/* 19 */
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
/* 20 */
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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(9));
__export(__webpack_require__(23));
__export(__webpack_require__(24));


/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var info_1 = __webpack_require__(0);
var Connect = (function () {
    function Connect() {
    }
    Connect.isConnectedProperty = function (propHolder, propKey) {
        var compInfo = info_1.ClassInfo.getInfo(propHolder);
        return compInfo && compInfo.connectedProps[propKey];
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
    Connect.removeConnectedProps = function (state, obj) {
        var info = info_1.ClassInfo.getInfo(obj);
        if (!info)
            return state;
        var newState = Object.assign({}, state);
        for (var _i = 0, _a = Object.keys(info.connectedProps); _i < _a.length; _i++) {
            var propKey = _a[_i];
            var sourceInfoString = '';
            var sourceInfo = info_1.ComponentInfo.getInfo(obj[propKey]);
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
exports.Connect = Connect;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(25);
var info_1 = __webpack_require__(0);
var reduxApp_1 = __webpack_require__(5);
var utils_1 = __webpack_require__(1);
var connectOptions_1 = __webpack_require__(9);
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
    options = Object.assign(new connectOptions_1.ConnectOptions(), options);
    var value = target[propertyKey];
    var info = info_1.ClassInfo.getOrInitInfo(target);
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
/* 25 */
/***/ (function(module, exports) {

module.exports = require("reflect-metadata");

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var info_1 = __webpack_require__(0);
var options_1 = __webpack_require__(2);
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
    var info = info_1.CreatorInfo.getOrInitInfo(ctor);
    info.options = Object.assign({}, options, new options_1.SchemaOptions(), options_1.globalOptions.schema);
}


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var info_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(1);
function computed(target, propertyKey) {
    var descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    if (typeof descriptor.get !== 'function')
        throw new Error("Failed to decorate '" + propertyKey + "'. The 'computed' decorator should only be used on getters.");
    if (descriptor.set)
        throw new Error("Failed to decorate '" + propertyKey + "'. Decorated property should not have a setter.");
    var info = info_1.ClassInfo.getOrInitInfo(target);
    info.computedGetters[propertyKey] = descriptor.get;
    return utils_1.deferredDefineProperty(target, propertyKey, utils_1.dataDescriptor);
}
exports.computed = computed;
var Computed = (function () {
    function Computed() {
    }
    Computed.removeComputedProps = function (state, obj) {
        var info = info_1.ClassInfo.getInfo(obj);
        if (!info)
            return state;
        var newState = Object.assign({}, state);
        for (var _i = 0, _a = Object.keys(info.computedGetters); _i < _a.length; _i++) {
            var propKey = _a[_i];
            newState[propKey] = Computed.placeholder;
        }
        return newState;
    };
    Computed.computeProps = function (obj) {
        var info = info_1.ClassInfo.getInfo(obj);
        if (!info)
            return;
        for (var _i = 0, _a = Object.keys(info.computedGetters); _i < _a.length; _i++) {
            var propKey = _a[_i];
            var getter = info.computedGetters[propKey];
            utils_1.log.verbose("[computeProps] computing new value of '" + propKey + "'");
            var newValue = getter.call(obj);
            var oldValue = obj[propKey];
            if (newValue !== oldValue) {
                utils_1.log.verbose("[computeProps] updating the state of '" + propKey + "'. New value: '" + newValue + "', Old value: '" + oldValue + "'.");
                obj[propKey] = newValue;
            }
        }
    };
    Computed.placeholder = '<computed>';
    return Computed;
}());
exports.Computed = Computed;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var info_1 = __webpack_require__(0);
function noDispatch(target, propertyKey) {
    noDispatchDecorator(target, propertyKey);
}
exports.noDispatch = noDispatch;
function sequence(target, propertyKey) {
    noDispatchDecorator(target, propertyKey);
}
exports.sequence = sequence;
function noDispatchDecorator(target, propertyKey) {
    var info = info_1.CreatorInfo.getOrInitInfo(target);
    info.noDispatch[propertyKey] = true;
}


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var info_1 = __webpack_require__(0);
var symbols_1 = __webpack_require__(3);
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
    var info = info_1.CreatorInfo.getOrInitInfo(target);
    info.childIds[propertyKey] = id || symbols_1.AUTO_ID;
}
var ComponentId = (function () {
    function ComponentId() {
    }
    ComponentId.nextAvailableId = function () {
        return --ComponentId.autoComponentId;
    };
    ComponentId.getComponentId = function (parentCreator, path) {
        if (!parentCreator || !path.length)
            return undefined;
        var info = info_1.CreatorInfo.getInfo(parentCreator);
        if (!info)
            return;
        var selfKey = path[path.length - 1];
        var id = info.childIds[selfKey];
        if (!id)
            return undefined;
        if (id === symbols_1.AUTO_ID) {
            var generatedId = ComponentId.nextAvailableId();
            utils_1.log.verbose('[getComponentId] new component id generated: ' + generatedId);
            info.childIds[selfKey] = generatedId;
            return generatedId;
        }
        return id;
    };
    ComponentId.autoComponentId = 0;
    return ComponentId;
}());
exports.ComponentId = ComponentId;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var info_1 = __webpack_require__(0);
function isInstanceOf(obj, type) {
    if (obj instanceof type)
        return true;
    var info = info_1.ComponentInfo.getInfo(obj);
    return !!(info && info.originalClass === type);
}
exports.isInstanceOf = isInstanceOf;


/***/ })
/******/ ]);
});
//# sourceMappingURL=redux-app.js.map