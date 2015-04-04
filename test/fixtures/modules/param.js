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

/**
 * We don't care about the first parameter for some reason
 * @param {number} b
 */
var subtract = function(a, b) {
	return b - 1;
};

/**
 * Mash two values together
 * @param {string} b
 * @param {number} a
 */
var combine = function(a, b) {
	return a.toString() + b.toString();
};

module.exports = {
	add: add,
	multBy2: multBy2,
	subtract: subtract,
	combine: combine
};
