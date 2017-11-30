# Change Log

## Unreleased

### Fix

- Component SchemaOptions handling.

## [1.9.0 - 2017-11-29](https://github.com/alonrbar/redux-app/tree/v1.9.0)

### Added

- New decorator: `ignoreState`.
- Allow `noDispatch` calls inside actions.
- Significant performance boost (reducers and update state logic refactored).

### Removed

- Breaking change: Can no longer use the `computed` decorator on non-components.

### Changed

- Some log messages changed/removed.

## [1.8.1 - 2017-11-18](https://github.com/alonrbar/redux-app/tree/v1.8.0)

- package-lock.json

## [1.8.0 - 2017-11-16](https://github.com/alonrbar/redux-app/tree/v1.8.0)

### Added

- Component inheritance.
- Return value from `noDispatch` methods.
- More informative errors and warnings.
- Check out the new [real world example](https://github.com/alonrbar/redux-app-examples/tree/master/src/angular/gladiators) in the [examples project](https://github.com/alonrbar/redux-app-examples).

### Changed

- Npm package only contains the source and dist files.
- Update docs.

### Fix

- Fix `computed` properties that are based on `connect`ed values.
- Fix reduction of arrays of objects when the array is initially undefined.

## [1.7.2 - 2017-11-8](https://github.com/alonrbar/redux-app/tree/v1.7.2)

### Added

- Expose and document the convertToPlainObject global option.

### Changed

- Use wepback's ModuleConcatenationPlugin to reduce library footprint and increase loading efficiency.

## [1.7.1 - 2017-11-5](https://github.com/alonrbar/redux-app/tree/v1.7.1)

### Fix

- Fix time travel.
- Fix and shorten some log messages.

## [1.7.0 - 2017-11-4](https://github.com/alonrbar/redux-app/tree/v1.7.0)

### Added

- Connection of components inside the app tree is now stable.
- The `computed` decorator is now stable.
- Can use the `computed` decorator on non-components (although must still be used inside the app tree).

### Changed

- Connected components sources are persisted only in the ReduxApp tree (and not in the store).
- Computed values are persisted only in the ReduxApp tree (and not in the store).
- Internal code organization changes.

### Fix

- Fix potential collision of connected components with IDs.

## [1.6.0 - 2017-10-31](https://github.com/alonrbar/redux-app/tree/v1.6.0)

### Added

- New decorator: connect.
- New static method ReduxApp.create (same as invoking the constructor directly, meant to help avoiding lint warnings).
- withId can be used without the parenthesis.

### Changed

- Marked the `computed` decorator as experimental (requires further testing and validation).
- Set default log level to `LogLevel.Warn`.
- Remove some verbose log messages.

### Fix

- Avoid invoking getters unnecessarily when probing for Component methods.
- Improve updateState logic. Array handling logic in specific.
- Improve pre-loaded state handling.

## [1.5.2 - 2017-10-25](https://github.com/alonrbar/redux-app/tree/v1.5.2)

### Changed

- Updated type definitions (d.ts file).
- Updated package exports (index.ts).

## [1.5.1 - 2017-10-25](https://github.com/alonrbar/redux-app/tree/v1.5.1)

### Added

- New decorator: `computed`.
- New utility function: `isInstanceOf`.
- New global option: `emitClassNames`.
- Handle pre-loaded state.

### Changed

- When updating state do not remove component properties that exists on the state but are undefined.
- The `updateState` option is now an app level option instead of a component level option.
- Throw if component method is invoked with non-component as 'this'.
- Verbose logs are emitted using `console.debug` instead of `console.log`.

### Fixed

- Major refactor to the library's internals that address several issues. The primary issues were:
  1. All patched methods were store on the same Component prototype. This would mean that two different classes having a method with the same name will dispatch the same action.
  2. Updates to components nested inside regular objects were not applied correctly.

## [1.4.0 - 2017-10-22](https://github.com/alonrbar/redux-app/tree/v1.4.0)

### Added

- Components are connected to the store even if nested inside non-component objects.
- Unit tests.

## [1.3.0 - 2017-10-21](https://github.com/alonrbar/redux-app/tree/v1.3.0)

### Added

- No limitations on component constructor (required parameter-less constructor before).

### Fixed

- Fix bug in getReducer and nested components.

## [1.2.0 - 2017-10-19](https://github.com/alonrbar/redux-app/tree/v1.2.0)

### Added

- New decorators: `withId`, `noDispatch` and `sequence`.

## [1.0.3 - 2017-10-19](https://github.com/alonrbar/redux-app/tree/v1.0.3)

### Added

- Packed as a UMD package.

## [0.0.0 - 2017-10-19](https://github.com/alonrbar/redux-app)

- Welcome redux-app!

---

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

#### [Types of changes](http://keepachangelog.com)

- **Added** for new features.
- **Changed** for changes in existing functionality.
- **Deprecated** for soon-to-be removed features.
- **Removed** for now removed features.
- **Fixed** for any bug fixes.
- **Security** in case of vulnerabilities.