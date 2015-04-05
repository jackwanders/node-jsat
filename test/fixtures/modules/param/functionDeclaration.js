/**
 * @param {number} a
 * @param {number} b
 */
function add(a, b) {
	var result = a + b;
	return result;
};

/**
 * append a number to a string
 * @param {number} b
 * @param {string} a
 */
function combine(a, b) {
	return a.toString() + b.toString();
};

/**
 * @param  {number} a
 */
function twice(a) {
	return a * 2;
};

module.exports = {
	add: add,
	combine: combine,
	twice: twice
};
