(function() {
	var __executed__ = false;
	return function(__original_parameters__) {
		if (!__executed__) {
			__executed__ = true;
			if (typeof console.trace === 'function') {
				console.trace(__annotation_value__);
			} else if (typeof console.warn === 'function') {
				console.warn(__annotation_value__);
			}
		}
		__original_body__;
	};
})()
