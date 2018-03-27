# redux-classic

Type-safe, DRY and OO redux. Implemented with typescript.

[![npm version](https://img.shields.io/npm/v/redux-classic.svg)](https://www.npmjs.com/package/redux-classic)
[![npm license](https://img.shields.io/npm/l/redux-classic.svg)](https://www.npmjs.com/package/redux-classic)
[![dependencies](https://david-dm.org/alonrbar/redux-classic.svg)](https://github.com/alonrbar/redux-classic)
[![dependencies](https://david-dm.org/alonrbar/redux-classic/dev-status.svg)](https://github.com/alonrbar/redux-classic)

[Change Log](https://github.com/alonrbar/redux-classic/blob/master/CHANGELOG.md)

## This is a clone of [redux-app](https://github.com/alonrbar/redux-app) and is planned to be the main repo

## Note: the public API is about to change - please still use [redux-app](https://github.com/alonrbar/redux-app) until this repo is stable

## Installation

```shell
yarn add redux-classic
```

or

```shell
npm install --save redux-classic
```

## Short Example

```javascript

//
// declare "reducers" and state
//

class App {
    counter = new Counter();
}

class Counter {
    value = 0;

    @action
    increment() {
        this.value = this.value + 1; // <--- see Important Notice below
    }
}

//
// instantiate
//

const app = ReduxClassic.create(new App());

//
// use
//

console.log(app.root.counter.value); // 0
console.log(app.store.getState()); // { counter: { value: 0 } }

app.root.counter.increment(); // will dispatch a 'Counter.increment' redux action

console.log(app.root.counter.value); // 1
console.log(app.store.getState()); // { counter: { value: 1 } }
```

## Important Notice

You should **not mutate** the object properties but rather assign them with new values.
That's why we write `this.value = this.value + 1` and not `this.value++`.

## More Examples

More examples, including usage with [Angular](https://angular.io) and [React](https://reactjs.org/), can be found here [redux-classic-examples](https://github.com/alonrbar/redux-classic-examples).

## How it works

For each decorated class the library generates an underlying `Module` object that holds the same properties and methods.
The new Module object has it's prototype patched and all of it's methods replaced with dispatch() calls.
The generated Module also has a hidden 'reducer' property which is later on used by redux store. The 'reducer' property itself is generated from the original object methods, replacing all 'this' values with the current state from the store on each call (using Object.assign and Function.prototype.call).

To make it easier to debug, each generated component name follows the following pattern: OriginalClassName_ReduxAppModule. If while debugging you don't see the _ReduxAppModule suffix it means the class was not replaced by an underlying component and is probably lacking a decorator (@action or @sequence).

_Reading the source tip #1: There are two main classes in redux-classic. The first is ReduxClassic and the second is Module._

## Documentation

- [Stay Pure](#stay-pure)
- Features
  - [Async Actions](#async-actions)
  - [Multiple Modules of the Same Type](#multiple-components-of-the-same-type)
  - [Computed Values ("selectors")](#computed-values)
  - [Ignoring Parts of the State](#ignoring-parts-of-the-state)
  - [Connect to a view](#connect-to-a-view)
    - [React](#react)
    - [Angular and others](#angular-and-others)
- Utilities
  - [isInstanceOf](#isinstanceof)
- [Applying Enhancers (devtools, etc.)](#applying-enhancers)
- Options
  - [App Options](#app-options)
  - [Global Options](#global-options)
- [Changelog](https://github.com/alonrbar/redux-classic/blob/master/CHANGELOG.md)

### Stay Pure

Although redux-classic embraces a new syntax it still adheres to [the three principals of redux](http://redux.js.org/docs/introduction/ThreePrinciples.html):

- The store is still the single source of truth. An automatic process propagates it to the components, similarly to what happens in react-redux.
- The state is still read only. **Don't mutate the component's state directly**, only via actions (methods).
- Changes are made with pure functions so keep your actions pure.

### Async Actions

Async actions (thunks, sagas, epics...) and side effects are handled in redux-classic by using the `sequence` decorator.
What it does is to tell redux-classic that the decorated method acts (almost) as a plain old javascript method. We say _almost_ since while the method body is executed regularly it still dispatches an action so it's still easy to track and log.

Remember:

- Don't change the state inside `sequence` methods.
- If you need to dispatch a series of actions use the `sequence` decorator. Don't call actions from within other actions directly.

Usage:

_working example can be found on the [redux-classic-examples](https://github.com/alonrbar/redux-classic-examples) page_

```javascript
class MyModule {

    @sequence
    public async fetchImage() {

        // dispatch an action
        this.setStatus('Fetching...');

        // do async stuff
        var response = await fetch('fetch something from somewhere');
        var responseBody = await response.json();

        // dispatch another action
        this.setStatus('Adding unnecessary delay...');

        // more async...
        setTimeout(() => {

            // more dispatch
            this.setStatus('I am done.');

        }, 2000);
    }

    @action
    public setStatus(newStatus: string) {
        this.status = newStatus;
    }
}
```

### Multiple Modules of the Same Type

The role of the `withId` decorator is double. From one hand, it enables the co-existence of two (or more) instances of the same component, each with it's own separate state. From the other hand, it is used to keep two separate components in sync. Every component, when dispatching an action attaches it's ID to the action payload. The reducer in it's turn reacts only to actions targeting it's component ID.
The 'id' argument of the decorator can be anything (string, number, object, etc.).

Example:

_working example can be found on the [redux-classic-examples](https://github.com/alonrbar/redux-classic-examples) page_

```javascript
export class App {

    @withId('SyncMe')
    public counter1 = new Counter();  // <-- this counter is in sync with counter2

    @withId('SyncMe')
    public counter2 = new Counter();  // <-- this counter is in sync with counter1

    @withId(123)
    public counter3 = new Counter();  // <-- manual set ID
                                      //     this counter is not synced with the others
    @withId()
    public counter4 = new Counter();  // <-- auto generated unique ID (unique within the scope of the application)
                                      //     this counter also has it's own unique state
}
```

### Connect to a view

You can leverage the following ReduxClassic static method to connect your state components to your view:

```javascript
ReduxClassic.getModule(componentType, componentId?, appId?)
```

You can use IDs to retrieve a specific component or omit the ID to get the first instance that redux-classic finds.

#### React

_working example can be found on the [redux-classic-examples](https://github.com/alonrbar/redux-classic-examples) page_

Use the snippet below to create an `autoSync` function. You can then use it as you would normally use react-redux's `connect`:

```jsx
const MyReactCounter: React.SFC<Counter> = (props) => (
    <div>
        <span>Value: {props.value}</span>
        <button onClick={props.increment}>Increment</button>
    </div>
);

const synced = autoSync(Counter)(MyReactCounter); // <-- using 'autoSync' here
export { synced as MyReactModule };
```

The `autoSync` snippet:

```javascript
import { connect } from 'react-redux';
import { Constructor, getMethods, ReduxClassic } from 'redux-classic';

export function autoSync<T>(stateType: Constructor<T>) {
    return connect<T>(() => {
        const comp = ReduxClassic.getModule(stateType);
        const compMethods = getMethods(comp, true);
        return Object.assign({}, comp, compMethods);
    });
}
```

#### Angular and others

_working example can be found on the [redux-classic-examples](https://github.com/alonrbar/redux-classic-examples) page_

With Angular and similar frameworks (like Aurelia) it's as easy as:

```javascript
class MyCounterView {
    public myCounterReference = ReduxClassic.getModule(Counter);

    // other view logic here...
}
```

### Computed Values

To calculate values from other parts of the components state instead of using a fancy _selector_ function you can simply use a standard javascript getter.

**Remember:** As everything else, getters should be pure and should not mutate the state.

Example:

_working example can be found on the [redux-classic-examples](https://github.com/alonrbar/redux-classic-examples) page_

```javascript
class ComputedGreeter {

    public name: string;

    public get welcomeString(): string {
        return 'Hello ' + this.name;
    }

    @action
    public setName(newVal: string) {
        this.name = newVal;
    }
}
```

### Ignoring Parts of the State

You can use the `ignoreState` decorator to prevent particular properties of your components to be stored in the store.

Example:

```javascript
class MyModule {

    public storeMe = 'hello';

    @ignoreState
    public ignoreMe = 'not stored';

    @action
    public changeState() {
        this.storeMe = 'I am stored';
    }
}

const app = ReduxClassic.create(new MyModule());

console.log(app.root); // { storeMe: 'hello', ignoreMe: 'not stored' }
console.log(app.store.getState()); // { storeMe: 'hello' }
```

### isInstanceOf

We've already said that classes decorated with the `component` decorator are being replaced at runtime
with a generated subclass of the base Module class. This means you lose the ability to have assertions
like this:

```javascript
class MyModule {
    @action
    public someAction() {
        // ...
    }
}

// and elsewhere:

if (!(obj instanceof MyModule))
    throw new Error("Invalid argument. Expected instance of MyModule");
```

Luckily redux-classic supplies a utility method called `isInstanceOf` which you can use instead:

```javascript
class MyModule {
    @action
    public someAction() {
        // ...
    }
}

// and elsewhere:

if (!isInstanceOf(obj, MyModule))
    throw new Error("Invalid argument. Expected instance of MyModule");
```

The updated code will throw either if `obj` is instance of `MyModule` or if it is an instance of a Module that was generated from the `MyModule` class. In all other cases the call to `isInstanceOf` will return `false` and no exception will be thrown.

### Applying Enhancers

The `ReduxClassic` class has few constructor overloads that lets you pass additional store arguments (for instance, the awesome [devtool extension](https://github.com/zalmoxisus/redux-devtools-extension) enhancer).

```javascript
constructor(appCreator: T, enhancer?: StoreEnhancer<T>);

constructor(appCreator: T, options: AppOptions, enhancer?: StoreEnhancer<T>);

constructor(appCreator: T, options: AppOptions, preloadedState: T, enhancer?: StoreEnhancer<T>);
```

Example:

```javascript
const app = ReduxClassic.create(new App(), devToolsEnhancer(undefined));
```

### App Options

```javascript
export class AppOptions {
    /**
     * Name of the newly created app.
     */
    name?: string;
    /**
     * By default each component is assigned (with some optimizations) with it's
     * relevant sub state on each store change. Set this to false to disable
     * this updating process. The store's state will still be updated as usual
     * and can always be retrieved using store.getState().
     * Default value: true.
     */
    updateState?: boolean;
}
```

Usage:

```javascript
const app = ReduxClassic.create(new App(), { updateState: false }, devToolsEnhancer(undefined));
```

### Global Options

```javascript
class GlobalOptions {
    /**
     * Default value: LogLevel.Warn
     */
    logLevel: LogLevel;
    /**
     * Customize actions naming.
     */
    action: ActionOptions;
}

enum LogLevel {
    /**
     * Emit no logs
     */
    None = 0,
    Verbose = 1,
    Debug = 2,
    Warn = 5,
    /**
     * Emit no logs (same as None)
     */
    Silent = 10
}

class ActionOptions {
    /**
     * Add the class name of the object that holds the action to the action name.
     * Format: <class name><separator><action name>
     * Default value: true.
     */
    actionNamespace?: boolean;
    /**
     * Default value: . (dot)
     */
    actionNamespaceSeparator?: string;
    /**
     * Use redux style action names. For instance, if a component defines a
     * method called 'incrementCounter' the matching action name will be
     * 'INCREMENT_COUNTER'.
     * Default value: false.
     */
    uppercaseActions?: boolean;
}
```

Usage:

```javascript
ReduxClassic.options.logLevel = LogLevel.Debug;
ReduxClassic.options.action.uppercaseActions = true;
```

### Changelog

The change log can be found [here](https://github.com/alonrbar/redux-classic/blob/master/CHANGELOG.md).