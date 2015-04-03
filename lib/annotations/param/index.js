var Annotation = require('../../Annotation');
var fs = require('fs');

/**
 * Construct an annotation to allow authors to mark functions as deprecated
 *
 * Usages:
 *   @param {type} foo - description of foo
 */
module.exports = new Annotation({
	name: 'param',
	targetType: 'function',
	template: fs.readFileSync(__dirname + '/transformer.tmpl.js', 'utf8'),
	customTransformers: [
		require('./transformer')
	],
	options: {
		force: true
	}
});
