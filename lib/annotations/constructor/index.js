var Annotation = require('../../Annotation');
var fs = require('fs');
var _ = require('lodash');

/**
 * Construct an annotation to enforce constructors to be called with 'new'
 *
 * Usages:
 *   @constructor
 */
module.exports = function(options) {
	var defaultOptions = {
		force: false
	};

	return new Annotation({
		name: 'constructor',
		aliases: ['class'],
		targetType: 'function',
		template: fs.readFileSync(__dirname + '/transformer.tmpl.js', 'utf8'),
		options: _.extend({}, defaultOptions, options)
	});
};
