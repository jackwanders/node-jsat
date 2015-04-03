/**
 * @param {number} a
 * @param {number} b
 */
var addTwoNumbers = (function() {
	var __parameters__ = [{"name":"a","type":"number"},{"name":"b","type":"number"}];
	return function(a, b) {
        Array.prototype.slice.call(arguments).forEach(function(arg, i) {
			if (typeof arg !== __parameters__[i].type) {
				var message = "addTwoNumbers expected '" + __parameters__[i].name +
					'\' to be a ' + __parameters__[i].type + ', but received a ' + (typeof arg);
				if (true) {
					console.warn(message);
				} else {
					throw new TypeError(message);
				}
			}
		});
        {
            var result = a + b;
            return result;
        }
    };
})();

module.exports = addTwoNumbers;
