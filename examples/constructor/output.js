/** @constructor */
var Car = function Car(make, model) {
    if (!(this instanceof Car)) {
		throw new SyntaxError("mising new keyword when calling Car constructor");
	}
    {
        this.make = make;
        this.model = model;
        this.toString = function() {
            return this.make + ' ' + this.model;
        }
    }
};

module.exports = Car;
