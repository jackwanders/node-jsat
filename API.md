# API Reference

* [Core](#core)
    - [`.transform(String source[, Object options])`](#jsattransformstring-source-object-options---string)
    - [Transform Options](#transform-options)
        + [`@deprecated`](#deprecated)
        + [`@constructor`](#constructor)
        + [`@param`](#param)

## Core

### `jsat.transform(String source[, Object options])` -> `String`

Applies annotation transformations to the provided string of source code and returns a string of transformed code.

### Transform Options

The transforms to apply as well as the effects of those transforms can be customized by passing an options `Object` to `jsat.transform`. This object accepts keys that match the names of supported annotations, like so:

```javascript
var output = jsat.transform(source, {
    deprecated: true,
    constructor: {
        force: true
    },
    param: false
});
```

The options object accepts three values:

* `true`: perform the transform with default options
* `false`: do not perform the transformation
* `Object`: perform the transform with custom options

The options for each annotation can be found below.

#### `@deprecated`

| option | type | default | effect
|:------ |:---- |:------- |:-------
| `logger` | `String` | `'trace'` | Specifies which `console` method to call when deprecated method is called.

#### `@constructor`

| option | type | default | effect
|:------ |:---- |:------- |:-------
| `force` | `Boolean` | `false` | Call `console.warn` (`true`) or throw a `SyntaxError` (`false`) when constructor is called without `new` keyword.

#### `@param`

| option | type | default | effect
|:------ |:---- |:------- |:-------
| `force` | `Boolean` | `true` | Call `console.warn` (`true`) or throw a `TypeError` (`false`) when function argument does not match expected parameter type.




