# node-jsat [![Build Status](https://travis-ci.org/jackwanders/node-jsat.svg?branch=master)](https://travis-ci.org/jackwanders/node-jsat) [![Coverage Status](https://coveralls.io/repos/jackwanders/node-jsat/badge.svg?branch=master)](https://coveralls.io/r/jackwanders/node-jsat?branch=master)

**J**ava**S**cript **A**nnotation **T**ransforms

### Installation

```bash
npm install --save jsat
```

### Purpose

Empower your JSDoc annotations by transforming your JavaScript to actually enforce them.

Say you maintain a package on npm with a well documented API. You have an API method that you'd like to deprecate, so you annotate it in your JSDoc block.

```javascript
/**
 * Add two numbers
 * @deprecated addTwoNumbers() will be removed in v2.0.0; please use add()
 */
exports.addTwoNumbers(firstNumber, secondNumber) {
    return firstNumber + secondNumber;
};
```

Awesome. Your documentation clear. But what if you wanted to actually make sure your users were aware of the upcoming breaking change? You could add a message in the function.

```javascript
/**
 * Add two numbers
 * @deprecated addTwoNumbers() will be removed in v2.0.0; please use add()
 */
exports.addTwoNumbers(firstNumber, secondNumber) {
    console.warn('addTwoNumbers() will be removed in v2.0.0; please use add()');
    return firstNumber + secondNumber;
};
```

Better, but awfully repetitive. `jsat` solves this problem by reading your source code's JSDoc comment blocks and automatically adding helpful logic that assists in enforcing supported annotations.

### Usage

```javascript
var jsat = require('jsat');
var fs = require('fs');
var source = fs.readFileSync('path/to/sourcefile.js', 'utf8');
var output = jsat.transform(source);
fs.writeFileSync('path/to/outputfile.js', output);
```

Calling `jsat.transform` on the string containing your source code will do the following:

1. Parse source code into an abstract syntax tree (AST) using [`recast`](https://github.com/benjamn/recast)
2. Traverse the AST, looking for nodes containing supported annotations in their comment blocks
3. Transform annotated nodes using the included transformer template defined by each annotation type
4. Print the AST back to a string and return it

Below is a list of currently supported JSDoc annotations (source can be viewed in the [`lib/annotations` directory](lib/annotations)).

| Annotation | Purpose | Effect of Transform
|------------|---------|---------------------
| `@deprecated` | Indicate that the function will be removed in a future release | Call `console.trace` or `console.warn` the first time the method is called, telling the user that the method is deprected
| `@constructor` (aka `@class`) | Indicate that the function should be used with the `new keyword` to create instances | Throw a `SyntaxError` if the function is called without the `new` keyword
| `@param` | Indicate expected type for function parameters | Warn when the annotated function receives an argument whose type does not match that indicated by the annotation

You can find example source and output files for these annotations in the [`examples` directory](examples).

### Transform Options

You can customize the output of `jsat` by providing options to `jsat.transform`. This allows you to decide which annotation transforms to apply as well as what options to provide to those transforms. For example, if you only want to apply `@deprecated` and `@constructor` transforms, and you want to force execution to continue of the lack of a `new` keyword is detected, then you can run:

```javascript
var output = jsat.transform(input, {
    constructor: {
        force: true
    },
    deprecated: true
});
```

By default, `jsat` will run your source through all available annotations, but when providing an `options` map, you must explicitly choose which annotation transforms to apply, either by setting the value of the annotation key to `true` or a map of options for that annotation type.

### Custom Annotations

In future releases, I hope to provide a robust API allowing developers to create their own custom annotation types and extract oft-repeated code snippets or control structures into `jsat` transformer templates.

### Build Plugins

I will also be working on plugins to allow injecting `jsat` into existing build tools, such as grunt and gulp.
