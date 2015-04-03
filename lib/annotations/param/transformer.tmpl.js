(function() {
	var __parameters__ = __parameter_list__;
	return function(__original_parameters__) {
		Array.prototype.slice.call(arguments).forEach(function(arg, i) {
			if (typeof arg !== __parameters__[i].type) {
				var message = '__original_id__ expected \'' + __parameters__[i].name +
					'\' to be a ' + __parameters__[i].type + ', but received a ' + (typeof arg);
				if (__options_force__) {
					console.warn(message);
				} else {
					throw new TypeError(message);
				}
			}
		});
		__original_body__;
	};
})()
