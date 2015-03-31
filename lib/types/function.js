var recast = require('recast');
var n = recast.types.namedTypes;
var fs = require('fs');
var _ = require('lodash');
var util = require('util');

/**
 * Annotation methods for annotations that target functions. This
 * includes both function declarations and function expressions that are part
 * of variable declarations.
 */
module.exports = {

	/**
	 * Determine if AST path has the desired annotation by inspecting its comments.
	 */
	pathIsAnnotated: function(path) {
		var self = this;

		var comments = path.get('comments').value;
		return _.reduce(comments, function(has, comment) {
			if (has) {
				return true;
			}
			return self.regex.test(comment.value);
		}, false);
	},

	variableDeclarationContainsFunctionExpression: function(path) {
		var declaration = path.get('declarations', 0, 'init');

		// If the variable declaration is assigning a function expression
		// to a variable, return true
		if (n.FunctionExpression.check(declaration.node)) {
			return true;
		}

		// If the declaration is assigning an IIFE that returns
		// a function expression, return true
		if (n.CallExpression.check(declaration.node)) {
			var callee = declaration.get('callee');
			if (n.FunctionExpression.check(callee.node)) {
				return true;
			}
		}

		return false;
	},

	/**
	 * Get all comment lines for the AST path and use this.valueRegex to find the value
	 */
	getValue: function(path) {
		if (!this.pathIsAnnotated(path)) {
			return null;
		}
		var match = _.pluck(path.get('comments').value, 'value').join('').match(this.valueRegex);
		if (!match || typeof match[1] === 'undefined') {
			return this.defaultValue;
		}
		return match[1];
	},

	/**
	 * For function-targeted annotations, visit function declarations as well as variable
	 * declarations that may contain function expressions
	 *
	 * If either node is found to have the given annotation, transform it accordingly
	 */
	visit: function(ast) {
		var self = this;
		recast.visit(ast, {
			visitFunctionDeclaration: function(path) {
				if (self.pathIsAnnotated(path)) {
					self.transformer.transformPath(self, path);
				}
				this.traverse(path);
			},
			visitVariableDeclaration: function(path) {
				if (self.pathIsAnnotated(path) && self.variableDeclarationContainsFunctionExpression(path)) {
					self.transformer.transformPath(self, path, path.get('declarations', 0, 'init'));
				}
				this.traverse(path);
			}
		});
	}
};
