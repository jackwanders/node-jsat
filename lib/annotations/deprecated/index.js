var Annotation = require('../../Annotation');
var fs = require('fs');
var _ = require('lodash');

/**
 * Construct an annotation to allow authors to mark functions as deprecated
 *
 * Usages:
 *   @deprecated
 *   @deprecated Specific message about deprecation and/or recourse
 */
module.exports = function(options) {
	var defaultOptions = {};

	return new Annotation({
		name: 'deprecated',
		defaultValue: 'This function is deprecated',
		targetType: 'function',
		template: fs.readFileSync(__dirname + '/transformer.tmpl.js', 'utf8'),
		options: _.extend({}, defaultOptions, options)
	});
};
