/** @constructor */
var Car = function Car(make, model) {
    if (!(this instanceof Car)) {
		var message = "mising new keyword when calling Car constructor";
		if (false) {
			console.warn(message);
		} else {
			throw new SyntaxError(message);
		}
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
