/** @constructor */
function Foo(a) {
	this.a = a;
};

/**
 * Build a bar
 * @class
 */
var Bar = function(b) {
	this.b = b;
};

module.exports = {
	Constructor: Foo,
	Class: Bar
};
