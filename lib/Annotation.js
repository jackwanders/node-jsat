var _ = require('lodash');
var types = require('./types');

/**
 * Build an annotation to transform nodes
 */
var Annotation = function(config) {
	if (!(this instanceof Annotation)) {
		throw new SyntaxError('missing new keyword when calling Annotation constructor');
	}

	this.config = config;
	this.slug = config.name;
	this.name = '@' + config.name;
	this.aliases = _.map(config.aliases, function(alias) {
		return '@' + alias;
	});

	// regex will match any line in a block comment that starts with the
	// provided annotation name
	var regexString = '^\\s?\\* (' + [this.name].concat(this.aliases).join('|') + ')\\b';

	// used to determine if a node contains the annotation
	this.regex = new RegExp(regexString, 'm');

	// used to get the possible values provided to the annotation
	// do a global match here to return all lines containing annotations
	this.valuesRegex = new RegExp(regexString + '(.*)?', 'mg');

	// used to get the actual value from a specific annotation line comment
	this.valueRegex = new RegExp(regexString + '(.*)?', 'm');

	// default annotation value in the case none is provided
	this.defaultValue = config.defaultValue;

	this.options = config.options;

	// template to transform annotated nodes
	this.template = config.template;

	this.customTransformers = config.customTransformers;

	// Extend this annotation instance with methods specific for the targeted node type
	_.extend(this, types[config.targetType]);
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
	var self = this;
	var match = comment.match(this.valuesRegex);

	var values = _.map(match, function(m) {
		var lineMatch = m.match(self.valueRegex);
		if (!lineMatch || typeof lineMatch[2] === 'undefined' || lineMatch[2].trim().length === 0) {
			return self.defaultValue;
		}
		return lineMatch[2].trim();
	});

	// return a single value if there's only one match
	return values.length === 1 ? values[0] : values;
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
