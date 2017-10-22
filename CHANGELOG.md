# Change Log

## [Unreleased](https://github.com/alonrbar/redux-app/tree/develop)

### Changed

- When updating state do not remove component properties that exists on the state but are undefined.

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

- New decorators: withId, noDispatch and sequence.

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