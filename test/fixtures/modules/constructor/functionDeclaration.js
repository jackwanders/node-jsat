/** @constructor */
function Car(make, model) {
	this.make = make;
	this.model = model;
};

/** @class */
function Truck(make, model) {
	this.make = make;
	this.model = model;
};

module.exports = {
	Car: Car,
	Truck: Truck
};
