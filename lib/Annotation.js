var _ = require('lodash');
var types = require('./types');

/**
 * Build an annotation to transform nodes
 */
var Annotation = function(options) {
	if (!(this instanceof Annotation)) {
		throw new SyntaxError('missing new keyword when calling Annotation constructor');
	}

	this.options = options;
	this.name = '@' + options.name;
	this.aliases = _.map(options.aliases, function(alias) {
		return '@' + alias;
	});

	// regex will match any line in a block comment that starts with the
	// provided annotation name
	var regexString = '^\\s?\\* (' + [this.name].concat(this.aliases).join('|') + ')\\b';

	// used to determine if a node contains the annotation
	this.regex = new RegExp(regexString, 'm');

	// used to get the possible value provided to the annotation
	this.valueRegex = new RegExp(regexString + '(.*)?', 'm');

	// default annotation value in the case none is provided
	this.defaultValue = options.defaultValue;

	// template to transform annotated nodes
	this.template = options.template;

	// Extend this annotation instance with methods specific for the targeted node type
	_.extend(this, types[options.targetType]);
};

/**
 * Detect existence of annotation name within a JSDoc comment block
 * JSDoc comments can be either mutli-line (like this one), or single line.
 *
 * Note that comment AST nodes do not include the slash-star and start-slash
 * that indicate the beginning and end of a comment.
 */
Annotation.prototype.commentContainsAnnotation = function(comment) {
	return this.regex.test(comment);
};

Annotation.prototype.getAnnotationValueFromComment = function(comment) {
	var match = comment.match(this.valueRegex);

	if (!match || typeof match[2] === 'undefined' || match[2].trim().length === 0) {
		return this.defaultValue;
	}

	return match[2].trim();
};

var convertCommentPathToString = function(path) {
	return _.pluck(path.get('comments').value, 'value').join('\n');
};

Annotation.prototype.pathIsAnnotated = function(path) {
	var commentString = convertCommentPathToString(path);
	return this.commentContainsAnnotation(commentString);
};

Annotation.prototype.getValue = function(path) {
	if (!this.pathIsAnnotated(path)) {
		return null;
	}
	var commentString = convertCommentPathToString(path);
	return this.getAnnotationValueFromComment(commentString);
};

module.exports = Annotation;
