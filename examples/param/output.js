/**
 * @param {number} a
 * @param {number} b
 */
var addTwoNumbers = function addTwoNumbers(a, b) {
    var $$param_types$$ = {"a":"number","b":"number"};
    var $$param_names$$ = ["a","b"];
    Array.prototype.slice.call(arguments).forEach(function(arg, i) {
		var param_name = $$param_names$$[i];
		var param_type = $$param_types$$[param_name];
		if (param_type && typeof arg !== param_type) {
			var message = "addTwoNumbers expected '" + param_name +
				'\' to be a ' + param_type + ', but received a ' + (typeof arg);
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

module.exports = addTwoNumbers;
