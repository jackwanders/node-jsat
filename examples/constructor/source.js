/** @constructor */
var Car = function(make, model) {
	this.make = make;
	this.model = model;
	this.toString = function() {
		return this.make + ' ' + this.model;
	}
};

module.exports = Car;
