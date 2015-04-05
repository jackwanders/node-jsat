/**
 * @param {number} a
 * @param {number} b
 */
var add = function(a, b) {
	var result = a + b;
	return result;
};

/**
 * append a number to a string
 * @param {number} b
 * @param {string} a
 */
var combine = function(a, b) {
	return a.toString() + b.toString();
};

/**
 * @param  {number} a
 */
var twice = function(a) {
	return a * 2;
}

module.exports = {
	add: add,
	combine: combine,
	twice: twice
};
