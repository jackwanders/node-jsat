/**
 * @param {number} a
 * @param {number} b
 */
var add = function(a, b) {
	var result = a + b;
	return result;
};

/**
 * @param {number} a - the number that you want to multiply by two
 */
var multBy2 = function(a) {
	return a * 2;
}

module.exports = {
	add: add,
	multBy2: multBy2
};
