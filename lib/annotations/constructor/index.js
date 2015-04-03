var Annotation = require('../../Annotation');
var fs = require('fs');

/**
 * Construct an annotation to enforce constructors to be called with 'new'
 *
 * Usages:
 *   @constructor
 */
module.exports = new Annotation({
	name: 'constructor',
	aliases: [
		'class'
	],
	targetType: 'function',
	template: fs.readFileSync(__dirname + '/transformer.tmpl.js', 'utf8')
});
