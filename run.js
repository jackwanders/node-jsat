var module = require('./dist/testmodule');

console.log(module.foo(1,3));
console.log(module.foo(10,20));

var myCar = new module.Car('mazdaspeed', '3');
console.log('my car is a ' + myCar.toString());

var myOtherCar = module.Car('lamborghini', 'diablo');
console.log('my other car is a ' + myOtherCar.toString());


