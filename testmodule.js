/**
 * The following is a source file used to test the annotation transformer
 */

/**
 * @deprecated testmodule.foo is deprecated because you can add on your own
 * another comment
 */
var foo = function(firstArgument, secondArgument) {
	console.info('i can add!');
	// inside comment
	return firstArgument + secondArgument;
};

/** @constructor */
var Car = function(make, model) {
	this.make = make;
	this.model = model;
	this.toString = function() {
		return this.make + ' ' + this.model;
	}
};


module.exports = {
	foo: foo,
	Car: Car
};
