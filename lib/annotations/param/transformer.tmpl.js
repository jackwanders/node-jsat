function __original_id__(__original_parameters__) {
	var $$param_types$$ = __param_type_map__;
	var $$param_names$$ = __param_name_list__;
	Array.prototype.slice.call(arguments).forEach(function(arg, i) {
		var param_name = $$param_names$$[i];
		var param_type = $$param_types$$[param_name];
		if (param_type && typeof arg !== param_type) {
			var message = '__original_id__ expected \'' + param_name +
				'\' to be a ' + param_type + ', but received a ' + (typeof arg);
			if (__options_force__) {
				console.warn(message);
			} else {
				throw new TypeError(message);
			}
		}
	});
	__original_body__;
}
