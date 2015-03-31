var Annotation = require('../../Annotation');

/**
 * Construct an annotation to enforce constructors to be called with 'new'
 *
 * Usages:
 *   @constructor
 */
module.exports = new Annotation({
	name: 'constructor',
	targetType: 'function',
	transformer: require('./transformer')
});
