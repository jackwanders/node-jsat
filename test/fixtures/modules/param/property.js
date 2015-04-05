module.exports = {

	/**
	 * @param {number} a
	 * @param {number} b
	 */
	add: function(a, b) {
		var result = a + b;
		return result;
	},

	/**
	 * append a number to a string
	 * @param {number} b
	 * @param {string} a
	 */
	combine: function(a, b) {
		return a.toString() + b.toString();
	},

	/**
	 * @param  {number} a
	 */
	twice: function(a) {
		return a * 2;
	}
};
