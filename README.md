# node-jsat

**J**ava**S**cript **A**nnotation **T**ransforms

### Installation

```bash
npm install --save jsat
```

### Usage

TBD. Package development in progress

The *idea* is to allow developers to save time by utilizing annotation comments to augment functionality of their source code. The current proof of concept annotation is `@deprecated`, which, when added to a function declaration or expression, will include a `console.warn` the first time that function is called, indicating to the user that the method is deprecated, along with a message defined in the annotation, like so:

```javascript
/**
 * Add two numbers together
 * @deprecated add is deprecated, please update your code to use betterAdd
 */
var add = function(a, b) {
    return a + b;
}
```

Running this source code through `jsat` will transform the source to:

```javascript
/**
 * Add two numbers together
 * @deprecated add is deprecated, please update your code to use betterAdd
 */
var add = (function() {
    var $$executed$$ = false;
    var ret = function(a, b) {
        if (!$$executed$$) {
            $$executed$$ = true;
            console.warn("add is deprecated, please update your code to use betterAdd");
        }
        {
            return a + b;
        }
    };
    return ret;
})();
```
