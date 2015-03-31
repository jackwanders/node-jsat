var _ = require('lodash');
var types = require('./types');

/**
 * Build an annotation to transform nodes
 */
var Annotation = function(options) {
	this.options = options;
	this.name = '@' + options.name;

	// regex will match any line in a block comment that starts with the
	// provided annotation name
	var regexString = '^ \\* ' + this.name;

	// used to determine if a node contains the annotation
	this.regex = new RegExp(regexString, 'm');

	// used to get the possible value provided to the annotation
	this.valueRegex = new RegExp(regexString + ' (.*)?', 'm');

	// default annotation value in the case none is provided
	this.defaultValue = options.defaultValue;

	// transformer module used to transform annotated nodes
	this.transformer = options.transformer;

	// Extend this annotation instance with methods specific for the targeted node type
	_.extend(this, types[options.targetType]);
};

module.exports = Annotation;