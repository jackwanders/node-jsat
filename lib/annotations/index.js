var _ = require('lodash');

var annotationBuilders = {
	constructor: require('./constructor'),
	deprecated: require('./deprecated'),
	param: require('./param')
};

/**
 * Pass the AST through the visit methods of all defined annotation types
 */
var enact = function(ast, options) {
	_.each(annotationBuilders, function(builder, slug) {
		var opts;

		// By default, run all annotations
		if (typeof options === 'object') {
			opts = options && options[slug];

			// Do not run annotations not included in options
			if (!opts) {
				return;
			}
		}

		var annotation = builder(opts);
		annotation.visit(ast);
	});
};

module.exports = {
	enact: enact
};
