function __original_id__(__original_parameters__) {
	if (typeof console.trace === 'function') {
		console.trace(__annotation_value__);
	} else if (typeof console.warn === 'function') {
		console.warn(__annotation_value__);
	}
	__original_body__;
}
