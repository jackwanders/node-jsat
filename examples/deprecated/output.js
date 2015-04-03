/**
 * @deprecated addTwoNumbers will be removed in 2.0.0. Please use addArbitraryNumbers
 */
var addTwoNumbers = (function() {
	var __executed__ = false;
	return function(a, b) {
        if (!__executed__) {
			__executed__ = true;
			if (typeof console.trace === 'function') {
				console.trace("addTwoNumbers will be removed in 2.0.0. Please use addArbitraryNumbers");
			} else if (typeof console.warn === 'function') {
				console.warn("addTwoNumbers will be removed in 2.0.0. Please use addArbitraryNumbers");
			}
		}
        {
            var result = a + b;
            return result;
        }
    };
})();

module.exports = addTwoNumbers;
