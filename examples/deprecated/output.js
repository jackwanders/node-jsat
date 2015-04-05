/**
 * @deprecated addTwoNumbers will be removed in 2.0.0. Please use addArbitraryNumbers
 */
var addTwoNumbers = function addTwoNumbers(a, b) {
    if (typeof console.trace === 'function') {
		console.trace("addTwoNumbers will be removed in 2.0.0. Please use addArbitraryNumbers");
	} else if (typeof console.warn === 'function') {
		console.warn("addTwoNumbers will be removed in 2.0.0. Please use addArbitraryNumbers");
	}
    {
        var result = a + b;
        return result;
    }
};

module.exports = addTwoNumbers;
