var Annotation = require('../../Annotation');
var fs = require('fs');
var _ = require('lodash');

/**
 * Construct an annotation to indicate expected argument types
 *
 * Usages:
 *   @param {string|number|boolean|object|function|null|undefined} foo - description of foo
 */
module.exports = function(options) {
	var defaultOptions = {
		force: true
	};

	return new Annotation({
		name: 'param',
		targetType: 'function',
		template: fs.readFileSync(__dirname + '/transformer.tmpl.js', 'utf8'),
		customTransformers: [
			require('./transformer')
		],
		options: _.extend({}, defaultOptions, options)
	});
};
