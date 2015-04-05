# 0.0.6 (April 5, 2015)

* Made `console` method called by `@deprecated` transform configurable (defaults to `.trace`)

# 0.0.5 (April 5, 2015)

* `@deprecated` transform now calls `console.warn` on all function calls
* Added ability to transform function declarations and object properties

# 0.0.4 (April 3, 2015)

* Added ability to configure `jsat.transform` with options
* Made `@param` transform more robust, accounting for missing annotations or annotations in the wrong order

# 0.0.3 (April 3, 2015)

* Added type-checking transform using @param annotation
* Added more tests

# 0.0.2 (April 2, 2015)

* Added support for single line JSDoc comments
* Fixed bugs in annotation detection
* Added unit tests for Annotation constructor

# 0.0.1 (April 1, 2015)

* Initial development release
