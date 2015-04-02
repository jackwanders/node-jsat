module.exports = function() {
	var Car = require('./output');
	console.log('\nCalling a constructor with and without new keyword\n');

	var dreamCar = new Car('Bugatti', 'Veyron');
	console.log('The ' + dreamCar.toString() + ' is a dream car.');

	try {
		var junker = Car('Ford', 'Pinto');
		console.log('What were they thinking when they made the ' + junker.toString() + '?');
	} catch (e) {
		console.log('Oh, looks like we caught an error. ', e);
	}
};
