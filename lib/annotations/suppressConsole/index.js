var Annotation = require('../../Annotation');

/**
 * Construct an annotation to allow authors to suppress calls to console
 *
 * Usages:
 *   @suppressConsole
 */
module.exports = new Annotation({
	name: 'suppressConsole',
	targetType: 'function',
	transformer: require('./transformer')
});
