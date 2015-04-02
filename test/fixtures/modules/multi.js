/**
 * Builds a car
 * @constructor
 * @deprecated We will no longer be building cars
 */
function Car(make, model) {
	this.make = make;
	this.model = model;
	this.toString = function() {
		return this.make + ' ' + this.model;
	};
};
