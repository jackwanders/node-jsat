function __original_id__(__original_parameters__) {
	if (!(this instanceof __original_id__)) {
		var message = 'mising new keyword when calling __original_id__ constructor';
		if (__options_force__) {
			console.warn(message);
		} else {
			throw new SyntaxError(message);
		}
	}
	__original_body__;
}
