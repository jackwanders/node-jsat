var Annotation = require('../../Annotation');

/**
 * Construct an annotation to allow authors to mark functions as deprecated
 *
 * Usages:
 *   @deprecated
 *   @deprecated Specific message about deprecation and/or recourse
 */
module.exports = new Annotation({
	name: 'deprecated',
	defaultValue: 'This function is deprecated',
	targetType: 'function',
	transformer: require('./transformer')
});
