(function() {
	var $$executed$$ = false;
	return function($$ANNOTATION_TARGET_FUNCTION_ARGUMENTS$$) {
		if (!$$executed$$) {
			$$executed$$ = true;
			console.warn($$ANNOTATION_VALUE$$);
		}
		$$ANNOTATION_TARGET_FUNCTION_BODY$$;
	};
})()
