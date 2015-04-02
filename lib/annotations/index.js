var _ = require('lodash');

var annotationTypes = {
	constructor: require('./constructor'),
	deprecated: require('./deprecated')
};

/**
 * Pass the AST through the visit methods of all defined annotation types
 * TODO: Allow a file to specify what annotations are desired (could speed up processing
 *       if there are a large number of annotation types to process)
 */
var enact = function(ast) {
	_.each(annotationTypes, function(annotation) {
		annotation.visit(ast);
	});
};

module.exports = {
	enact: enact
};
