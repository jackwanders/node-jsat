/** @constructor */
var Car = function(make, model) {
	this.make = make;
	this.model = model;
};

/** @class */
var Truck = function(make, model) {
	this.make = make;
	this.model = model;
};

module.exports = {
	Car: Car,
	Truck: Truck
};
