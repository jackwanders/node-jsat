/** @constructor */
function Foo(a) {
	this.a = a;
};

/**
 * @class
 */
var Bar = function(b) {
	this.b = b;
};

module.exports = {
	ConstructorFn: Foo,
	ClassFn: Bar
};
