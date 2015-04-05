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

### API

For documentation on `jsat`'s API, please read the [API Reference](API.md).

### Examples

You can find example source and output files for these annotations in the [`examples` directory](examples).

### Custom Annotations

In future releases, I hope to provide a robust API allowing developers to create their own custom annotation types and extract oft-repeated code snippets or control structures into `jsat` transformer templates.

### Build Plugins

I will also be working on plugins to allow injecting `jsat` into existing build tools, such as grunt and gulp.
