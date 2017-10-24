# Acknowledgment

#### I've found some painful **bugs** in redux-app core. The examples still work but some more real-life use cases may fail. I'm working on fixing the issues and hoping to release a fixed version in the next couple of days. Stay tuned.

# redux-app

Type-safe, DRY and OO redux. Implemented with typescript.

[![npm version](https://img.shields.io/npm/v/redux-app.svg)](https://www.npmjs.com/package/redux-app)
[![npm license](https://img.shields.io/npm/l/redux-app.svg)](https://www.npmjs.com/package/redux-app)
[![dependencies](https://david-dm.org/alonrbar/redux-app.svg)](https://github.com/alonrbar/redux-app)
[![dependencies](https://david-dm.org/alonrbar/redux-app/dev-status.svg)](https://github.com/alonrbar/redux-app)

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
        this.value = value + 1; // <--- see Important Notice below
    }
}

const app = new ReduxApp(new App(), devToolsEnhancer(undefined));

console.log(app.root.counter.value); // 0
console.log(app.store.getState()); // { counter: { value: 0 } }

app.root.counter.increment(); // will dispatch COUNTER.INCREMENT redux action

console.log(app.root.counter.value); // 1
console.log(app.store.getState()); // { counter: { value: 1 } }
```

## Important Notice

You should **not mutate** the object properties but rather assign them with new values.
That's why we write `this.value = value + 1` and not `this.value++`.

## More Examples

More examples can be found here [redux-app-examples](https://github.com/alonrbar/redux-app-examples).

## How it works

For each `component` decorated class the library generates an underlying `Component` object that holds the same properties and methods.
The new Component object has it's prototype patched and all of it's methods replaced with dispatch() calls.
The generated Component also has a hidden 'REDUCER' property which is later on used by redux store. The 'REDUCER' property itself is
generated from the original object methods, replacing all 'this' values with the current state from the store on each call (using
Object.assign and Function.prototype.call).

_Reading the source tip #1: There are two main classes in redux-app. The first is ReduxApp (~70 lines) and the second is Component (~220 lines)._

## Documentation

- [Important Notice](#important-notice)
- [Examples](https://github.com/alonrbar/redux-app-examples)
- [How it works](#how-it-works)
- [Async Actions](#async-actions)
- [The `withId` decorator - "mini ORM" feature](#withid)
- [Options](#options)
  - [Component Options](#component-options)
  - [Global Options](global-options)

### Async Actions

Async actions and side effects are handled in redux-app by using either the `sequence` decorator or the `noDispatch`.
Both decorators does **exactly the same** and are actually aliases of the same underlying function. What they do is
to tell redux-app that the decorated method is a plain old javascript method and that it should not be patched (about
the patch process see [How it works](#how-it-works)). So, to conclude, what these decorators actually do is to tell
redux-app to _do nothing special_ with the method.

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

### withId

The role of the `withId` decorator is double. From one hand, it enables the co-existence of two (or more) instances of the same component,
each with it's own separate state. From the other hand, it is used to keep two separate components in sync. The 'id' argument of the decorator
can be anything (string, number, object, etc.).

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

### Options

#### Component Options

You can supply the following options to the `component` decorator.

```javascript
class SchemaOptions {
    /**
     * Add the class name of the object that holds the action to the action name.
     * Format: <class name>.<action name>.
     * Default value: true.
     */
    public actionNamespace?: boolean;
    /**
     * Use redux style action names. For instance, if a component defines a
     * method called 'incrementCounter' the matching action name will be
     * 'INCREMENT_COUNTER'.
     * Default value: true.
     */
    public uppercaseActions?: boolean;
    /**
     * By default each component is assigned (with some optimizations) with it's
     * relevant sub state on each store change. Set this to false to disable
     * this updating process. The store's state will still be updated as usual
     * and can always be retrieved using store.getState().
     * Default value: true.
     */
    public updateState?: boolean;
}
```

Usage:

```javascript
@component({ uppercaseActions: false })
class Counter {
    value = 0;

    increment() { // <-- Will now dispatch 'Counter.increment' instead of 'COUNTER.INCREMENT'. Everything else still works the same, no further change required.
        this.value = value + 1;
    }
}
```

#### Global Options

Available global options:

```javascript
class GlobalOptions {
    logLevel: LogLevel;
    /**
     * Global defaults.
     * Options supplied explicitly via the decorator will override options specified here.
     */
    schema: SchemaOptions;
}

enum LogLevel {
    /**
     * Emit no logs
     */
    None = 0,
    Verbose = 1,
    Debug = 2,
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
