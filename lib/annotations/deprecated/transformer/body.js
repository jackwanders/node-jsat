(function() {
	var $$executed$$ = false;
	var ret = function($$ANNOTATION_TARGET_FUNCTION_ARGUMENTS$$) {
		if (!$$executed$$) {
			$$executed$$ = true;
			console.warn($$ANNOTATION_VALUE$$);
		}
		$$ANNOTATION_TARGET_FUNCTION_BODY$$;
	};
	return ret;
})()
