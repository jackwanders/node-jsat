module.exports = function() {
	var addTwoNumbers = require('./output');
	console.log('\nCalling a deprecated method twice\n');

	var sum1 = addTwoNumbers(1, 2);
	console.log('1 + 2 = ' + sum1);

	var sum2 = addTwoNumbers(3, 4);
	console.log('3 + 4 = ' + sum2);
};
