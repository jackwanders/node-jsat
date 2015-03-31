var module = require('./dist/testmodule');

console.log(module.exportBar(1,3));
console.log(module.exportFoo(1,3));
console.log(module.exportFoo(10,20));

