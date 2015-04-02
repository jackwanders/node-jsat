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
	var regexString = '^\\s?\\* (' + [this.name].concat(this.aliases).join('|') + ')';

	// used to determine if a node contains the annotation
	this.regex = new RegExp(regexString, 'm');

	// used to get the possible value provided to the annotation
	this.valueRegex = new RegExp(regexString + ' (.*)?', 'm');

	// default annotation value in the case none is provided
	this.defaultValue = options.defaultValue;

	// template to transform annotated nodes
	this.template = options.template;

	// Extend this annotation instance with methods specific for the targeted node type
	_.extend(this, types[options.targetType]);
};

Annotation.prototype.pathIsAnnotated = function(path) {
	var self = this;

	var comments = path.get('comments').value;
	return _.reduce(comments, function(has, comment) {
		if (has) {
			return true;
		}
		return self.regex.test(comment.value);
	}, false);
};

Annotation.prototype.getValue = function(path) {
	if (!this.pathIsAnnotated(path)) {
		return null;
	}
	// block comments are represented by an array of line values, so pluck them all and merge them
	var match = _.pluck(path.get('comments').value, 'value').join('\n').match(this.valueRegex);
	if (!match || typeof match[2] === 'undefined') {
		return this.defaultValue;
	}
	return match[2].trim();
};

module.exports = Annotation;
