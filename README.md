# redux-app

Type-safe, DRY and OO redux. Implemented with typescript.

[![npm version](https://img.shields.io/npm/v/redux-app.svg)](https://www.npmjs.com/package/redux-app)
[![npm license](https://img.shields.io/npm/l/redux-app.svg)](https://www.npmjs.com/package/redux-app)
[![dependencies](https://david-dm.org/alonrbar/redux-app.svg)](https://github.com/alonrbar/redux-app)
[![dependencies](https://david-dm.org/alonrbar/redux-app/dev-status.svg)](https://github.com/alonrbar/redux-app)

[Change Log](https://github.com/alonrbar/redux-app/blob/master/CHANGELOG.md)

## Installation

```shell
npm install --save redux-app
```

## Short Example

```javascript
@component
class App {
    counter = new Counter();
}

@component
class Counter {
    value = 0;

    increment() {
        this.value = this.value + 1; // <--- see Important Notice below
    }
}

const app = new ReduxApp(new App());

console.log(app.root.counter.value); // 0
console.log(app.store.getState()); // { counter: { value: 0 } }

app.root.counter.increment(); // will dispatch COUNTER.INCREMENT redux action

console.log(app.root.counter.value); // 1
console.log(app.store.getState()); // { counter: { value: 1 } }
```

## Important Notice

You should **not mutate** the object properties but rather assign them with new values.
That's why we write `this.value = this.value + 1` and not `this.value++`.

## More Examples

More examples, including usage with [Angular](https://angular.io), [Aurelia](http://aurelia.io) and [React](https://reactjs.org/), can be found here [redux-app-examples](https://github.com/alonrbar/redux-app-examples).

## How it works

For each `component` decorated class the library generates an underlying `Component` object that holds the same properties and methods.
The new Component object has it's prototype patched and all of it's methods replaced with dispatch() calls.
The generated Component also has a hidden 'reducer' property which is later on used by redux store. The 'reducer' property itself is
generated from the original object methods, replacing all 'this' values with the current state from the store on each call (using
Object.assign and Function.prototype.call).

_Reading the source tip #1: There are two main classes in redux-app. The first is ReduxApp and the second is Component._

## Documentation

- [Stay Pure](#stay-pure)
- [Features](#features)
  - [Async Actions](#async-actions)
  - [The `withId` decorator - "mini ORM" feature](#withid)
  - [`connect` to the view](#withid)
  - [Computed Values](#computed-values)
- [Utilities](#utilities)
  - [`ignoreState`](#ignorestate)
  - [`isInstanceOf`](#isinstanceof)
- [Applying Enhancers (devtools, etc.)](#applying-enhancers)
- [Options](#options)
  - [Component Options](#component-options)
  - [Computed Options](#computed-options)
  - [App Options](#app-options)
  - [Global Options](#global-options)
- [Changelog](https://github.com/alonrbar/redux-app/blob/master/CHANGELOG.md)

### Stay Pure

Although redux-app embraces a new syntax it still adheres to [the three principals of redux](http://redux.js.org/docs/introduction/ThreePrinciples.html):

- The store is still the single source of truth. An automatic process propagates it to the components, similarly to what happens in react-redux.
- The state is still read only. **Don't mutate the component's state directly**, only via actions (methods).
- Changes are made with pure functions so **keep your actions pure**.

### Features

#### Async Actions

Async actions (thunks, sagas, epics...) and side effects are handled in redux-app by using either the `sequence` decorator or the `noDispatch`.
Both decorators does **exactly the same** and are actually aliases of the same underlying function. What they do is
to tell redux-app that the decorated method is a plain old javascript method and that it should not be patched (about
the patch process see [How it works](#how-it-works)). So, to conclude, what these decorators actually do is to tell
redux-app to _do nothing special_ with the method.

Remember:

- Don't change the state inside `noDispatch` methods.
- If you need to dispatch a series of actions use the `sequence` decorator. Don't call actions from within other actions directly.

Usage:

_working example can be found on the [redux-app-examples](https://github.com/alonrbar/redux-app-examples) page_

```javascript
@component
class MyComponent {

    public setStatus(newStatus: string) { // <--- Not decorated. Will dispatch SET_STATUS action.
        this.status = newStatus;
    }

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

    @noDispatch
    public doNothing() {
        console.log('I am a plain old method. Nothing special here.');
    }
}
```

#### withId

The role of the `withId` decorator is double. From one hand, it enables the co-existence of two (or more) instances of the same component,
each with it's own separate state. From the other hand, it is used to keep two separate components in sync. Every component, when dispatching
an action attaches it's ID to the action payload. The reducer in it's turn reacts only to actions targeting it's component ID.
The 'id' argument of the decorator can be anything (string, number, object, etc.).

Example:

_working example can be found on the [redux-app-examples](https://github.com/alonrbar/redux-app-examples) page_

```javascript
@component
export class App {

    @withId('SyncMe')
    public counter1 = new CounterComponent();  // <-- this counter is in sync with counter2

    @withId('SyncMe')
    public counter2 = new CounterComponent();  // <-- this counter is in sync with counter1

    @withId(123)
    public counter3 = new CounterComponent();  // <-- manual set ID
                                               // this counter is not synced with the others
    @withId()
    public counter4 = new CounterComponent();  // <-- auto generated unique ID (unique within the scope of the application)
                                               // this counter also has it's own unique state
}
```

#### connect

One of the most useful features of redux-app is the ability to `connect` components. Connected components are *references* to other components.
The connection is achieved using a "smart getter".
It is smart in that sense that it waits for the target component to be available and than replace itself
(i.e. the getter) with a simple reference to the target object, thus preventing further unnecessary invocations of the getter.

You can use IDs to connect to a specific component or omit the ID to connect to the first instance that redux-app finds.

You can connect a view to parts of the app tree, as shown in the next example. You can also connect two, or more, components to a single source inside your app tree. To see a working example of the latter checkout the [examples](https://github.com/alonrbar/redux-app-examples) repository.

**Remember**: When connecting components there should always be at least one non-connected instance of that component in your ReduxApp tree (a.k.a. the "source" component).

Example:

_working example can be found on the [redux-app-examples](https://github.com/alonrbar/redux-app-examples) page_

```javascript
@component
class App {
    public myComponent = new MyComponent();
}

@component
class MyComponent {
    public message = 'hello!';
}

const app = new ReduxApp(new App());

// and elsewhere, in a regular class:

class MyView {
    @connect
    public myComponentReference: MyComponent;    // <-- points to 'myComponent' of 'app'.
}
```

You can pass an optional 'options' argument to the `connect` decorator:

```javascript
export class ConnectOptions {
    /**
     * The name of the ReduxApp instance to connect to.
     * If not specified will connect to default app.
     */
    app?: string;
    /**
     * The ID of the target component (assuming the ID was assigned to the component 
     * by the 'withId' decorator).
     * If not specified will connect to the first available component of that type.
     */
    id?: any;
    /**
     * The 'connect' decorator uses a getter to connect to the it's target. By
     * default the getter is replaced with a standard value (reference) once the
     * first non-empty value is retrieved. Set this value to true to leave the
     * getter in place.
     * Default value: false
     */
    live?: boolean;
}
```

#### Computed Values

It is possible to automatically calculate values from other parts of the components state (similar in concept to redux selectors).
To do that just declare a getter and decorate it with the `computed` decorator. Behind the scenes redux-app will replace the getter
with regular values and will take care of updating it after each change to the relevant state.

**Note:** As everything else, computed value getters should also be pure and should not mutate other parts of the state.

Example:

_working example can be found on the [redux-app-examples](https://github.com/alonrbar/redux-app-examples) page_

```javascript
@component
class ComputedGreeter {

    public name: string;

    @computed
    public get welcomeString(): string { // <-- updates when 'name' changes
        return 'hello ' + this.name;
    }

    public setName(newVal: string) {
        this.name = newVal;
    }
}
```

### Utilities

#### ignoreState

You can use the `ignoreState` decorator to prevent particular properties of your components to be stored in the store.

Example:

```javascript
@component
class MyComponent {
    
    public storeMe = 'hello';

    @ignoreState
    public ignoreMe = 'not stored';
}

const app = new ReduxApp(new MyComponent());

console.log(app.root); // { storeMe: 'hello', ignoreMe: 'not stored' }
console.log(app.store.getState()); // { storeMe: 'hello' }
```

#### isInstanceOf

We've already said that classes decorated with the `component` decorator are being replaced at runtime
with a generated subclass of the base Component class. This means you lose the ability to have assertions
like this:

```javascript
@component
class MyComponent {
    // ...
}

// and elsewhere:

if (!(obj instanceof MyComponent))
    throw new Error("Invalid argument. Expected instance of MyComponent");
```

Luckily redux-app supplies a utility method called `isInstanceOf` which you can use instead:

```javascript
@component
class MyComponent {
    // ...
}

// and elsewhere:

if (!isInstanceOf(obj, MyComponent))
    throw new Error("Invalid argument. Expected instance of MyComponent");
```

The updated code will throw either if `obj` is instance of `MyComponent` or if it is an instance of a Component that was generated from the `MyComponent` class. In all other cases the call to `isInstanceOf` will return `false` and no exception will be thrown.

### Applying Enhancers

The `ReduxApp` class has few constructor overloads that lets you pass additional store arguments (for instance, the awesome [devtool extension](https://github.com/zalmoxisus/redux-devtools-extension) enhancer).

```javascript
constructor(appCreator: T, enhancer?: StoreEnhancer<T>);

constructor(appCreator: T, options: AppOptions, enhancer?: StoreEnhancer<T>);

constructor(appCreator: T, options: AppOptions, preloadedState: T, enhancer?: StoreEnhancer<T>);
```

Example:

```javascript
const app = new ReduxApp(new App(), devToolsEnhancer(undefined));
```

### Options

#### Component Options

You can supply the following options to the `component` decorator.

```javascript
class SchemaOptions {
    /**
     * Add the class name of the object that holds the action to the action name.
     * Format: <class name>.<action name>
     * Default value: true.
     */
    actionNamespace?: boolean;
    /**
     * Use redux style action names. For instance, if a component defines a
     * method called 'incrementCounter' the matching action name will be
     * 'INCREMENT_COUNTER'.
     * Default value: true.
     */
    uppercaseActions?: boolean;
}
```

Usage:

```javascript
@component({ uppercaseActions: false })
class Counter {
    value = 0;

    increment() { // <-- Will now dispatch 'Counter.increment' instead of 'COUNTER.INCREMENT'. Everything else still works the same, no further change required.
        this.value = this.value + 1;
    }
}
```

#### Computed Options

Customize `computed` properties via `ReduxApp.options.computed`.

```javascript
class ComputedOptions {
    /**
     * Whether to perform deep comparison or a simple equality comparison
     * before updating computed values. Using deep comparison has a small
     * additional performance cost.
     * Default value: true.
     */
    deepComparison: boolean;
}
```

#### App Options

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
const app = new ReduxApp(new App(), { updateState: false }, devToolsEnhancer(undefined));
```

#### Global Options

Available global options:

```javascript
class GlobalOptions {
    /**
     * Default value: LogLevel.Warn
     */
    logLevel: LogLevel;
    /**
     * When set to 'true' every component will have an additional __originalClassName__ property.
     * Can be useful for debugging.
     * Default value: false.
     */
    emitClassNames: boolean;
    /**
     * From the original redux FAQ: 
     * ----------------------------
     *
     * Q: Can I put functions, promises, or other non-serializable items in my
     * store state?
     *
     * A: It is highly recommended that you only put plain serializable objects,
     * arrays, and primitives into your store. It's technically possible to
     * insert non-serializable items into the store, but doing so can break the
     * ability to persist and rehydrate the contents of a store, as well as
     * interfere with time-travel debugging.
     *
     * If you are okay with things like persistence and time-travel debugging
     * potentially not working as intended, then you are totally welcome to put
     * non-serializable items into your Redux store. Ultimately, it's your
     * application, and how you implement it is up to you. As with many other
     * things about Redux, just be sure you understand what tradeoffs are
     * involved.
     *
     * The case in redux-app:
     * ----------------------
     *
     * By default redux-app aligns with redux recommendations and treats
     * everything stored in the store state as a plain object to prevent the
     * previously described issues. This approach may come with some performance
     * (and of course usability) cost. Therefor if you don't care about time
     * travel debugging or rehydration of the store content etc. and you don't
     * want to pay the aforementioned cost you can set this option to false.
     *
     * Default value: true.
     */
    convertToPlainObject?: boolean;
    /**
     * Global defaults.
     * Options supplied explicitly via the decorator will override options specified here.
     */
    schema: SchemaOptions;
    /**
     * Customize `computed` properties behavior.
     */
    computed: ComputedOptions;
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
```

Usage:

```javascript
ReduxApp.options.logLevel = LogLevel.Debug;
```

### Changelog

The change log can be found [here](https://github.com/alonrbar/redux-app/blob/master/CHANGELOG.md).