# node-jsat [![Build Status](https://travis-ci.org/jackwanders/node-jsat.svg?branch=master)](https://travis-ci.org/jackwanders/node-jsat)

**J**ava**S**cript **A**nnotation **T**ransforms

### Installation

```bash
npm install --save jsat
```

### Usage

TBD. Package development in progress

The *idea* is to allow developers to save time by utilizing JSDoc-style annotation comments to augment functionality of their source code. As an example, consider the included `@deprecated` annotation, which, when added to a function declaration or expression, will include a `console.trace` the first time that function is called, indicating to the user that the method is deprecated, along with a message defined in the annotation and a stack trace so that the developer can find where in their own source they are calling the deprecated method.

If you'd like to see `jsat` in action, do the following:

* Checkout this repo
* run `node build.js` to convert `/testmodule.js` to `/dist/testmodule.js` using `jsat`
* compare `/testmodule.js` and `/dist/testmodule.js` to see the changes made to the code by `jsat`
* run `node test.js` to execute the transformed source in the terminal

### TODO

* Create a simple framework for creating new annotation types, focusing on the process of writing the transform module
* Create a small library of (hopefully) useful annotation transforms
* Create a grunt or browserify plugin so that this can be included in existing build processes
