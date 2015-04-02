# node-jsat [![Build Status](https://travis-ci.org/jackwanders/node-jsat.svg?branch=master)](https://travis-ci.org/jackwanders/node-jsat)

**J**ava**S**cript **A**nnotation **T**ransforms

### Installation

```bash
npm install --save jsat
```

### Usage

TBD. Package development in progress

The *idea* is to allow developers to save time by utilizing JSDoc-style annotation comments to augment functionality of their source code. As an example, consider the [`@deprecated` annotation](http://usejsdoc.org/tags-deprecated.html), which is intended to tell other developers that a particular method should no longer be used. This is great for documentation, but we can do better. When you run your source code through `jsat` all deprecated methods will call `console.trace` the first time that function is called, indicating to the user that the method is deprecated, along with the message defined alongside the original annotation. The message and the included stack trace can help developers find where in their own source they are calling the deprecated method and make the appropriate change.

Below is a list of annotation transforms currently being developed.

| Annotation | Purpose | Effect of Transform
|------------|---------|---------------------
| `@deprecated` | Indicate that the function should no longer be relied upon | Call `console.trace` or `console.warn` the first time the method is called, telling the user that the method is deprected
| `@constructor` (aka `@class`) | Indicate that the function should be used with the `new keyword` to create instances | Throw a `SyntaxError` if the function is called without the `new` keyword

If you'd like to see `jsat` in action, do the following:

* Checkout this repo
* run `node build.js` to convert `/testmodule.js` to `/dist/testmodule.js` using `jsat`
* compare `/testmodule.js` and `/dist/testmodule.js` to see the changes made to the code by `jsat`
* run `node run.js` to execute the transformed source in the terminal

### TODO

* Create a simple framework for creating new annotation types, focusing on the process of writing the transform module
* Create a small library of (hopefully) useful annotation transforms
* Create a grunt or browserify plugin so that this can be included in existing build processes
