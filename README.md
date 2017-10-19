# redux-app

Type-safe, DRY and OO redux. Implemented with typescript.

## Installation

```
npm install --save redux-app
```

## Example
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

## How it works

For each `component` decorated class the library generates an underlying `Component` object that holds the same properties and method. The new Component object has it's prototype patched and all of it's methods replaced with dispatch() calls.
The generated Component also has a hidden 'REDUCER' property which is later on used by redux store. The 'REDUCER' property itself is generated from the original object methods, replacing all 'this' values with the current state from the store on each call (using Object.assign and Function.prototype.call).

## Component Options

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

## Global Options

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
