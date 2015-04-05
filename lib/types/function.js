var recast = require('recast');
var n = recast.types.namedTypes;
var transformer = require('./transformers/function');

/**
 * Annotation methods for annotations that target functions. This
 * includes both function declarations and function expressions that are part
 * of variable declarations.
 */
module.exports = {

	getFunctionExpression: function(path) {
		// If the path is a function expression, return it
		if (n.FunctionExpression.check(path.node)) {
			return path;
		}

		// If the path is an IIFE, find the IIFE's return value and determine if
		// it is a function expression
		if (n.CallExpression.check(path.node)) {
			var variables = {};
			var finalReturnValue;

			// visit the path, storing a list of all variable values
			// When we get to the final return statement, check to see
			// if it's either a function expression or a variable containing one
			recast.visit(path, {
				visitVariableDeclaration: function(path) {
					var name = path.get('declarations', 0, 'id', 'name').value;
					var value = path.get('declarations', 0, 'init');
					variables[name] = value;
					this.traverse(path);
				},

				visitReturnStatement: function(path) {
					var returnArgument = path.get('argument');
					if (n.Identifier.check(returnArgument.node)) {
						finalReturnValue = variables[returnArgument.get('name').value];
					} else {
						finalReturnValue = returnArgument;
					}
					this.traverse(path);
				}
			});

			if (n.FunctionExpression.check(finalReturnValue.node)) {
				return finalReturnValue;
			}
		}

		return null;
	},

	transformPath: function(annotation, tmpl, rootPath, functionExpression) {
		if (!functionExpression) {
			functionExpression = rootPath;
		}
		var ast = recast.parse(tmpl);
		transformer.transformPath(annotation, ast, rootPath, functionExpression);
	},

	/**
	 * For function-targeted annotations, visit three types of nodes:
	 *  - object properties (which may have function expressions assigned to them)
	 *  - function declarations
	 *  - variable declarations (which may have function expressions assigned to them)
	 *
	 * If these nodes are found to have the given annotation, transform them accordingly
	 */
	visit: function(ast) {
		var self = this;
		recast.visit(ast, {

			visitProperty: function(path) {
				if (self.pathIsAnnotated(path)) {
					var functionExpression = self.getFunctionExpression(path.get('value'));
					if (functionExpression) {
						self.transformPath(self, self.template, path, functionExpression);
					}
				}
				this.traverse(path);
			},

			visitFunctionDeclaration: function(path) {
				if (self.pathIsAnnotated(path)) {
					self.transformPath(self, self.template, path);
				}
				this.traverse(path);
			},

			visitVariableDeclaration: function(path) {
				if (self.pathIsAnnotated(path)) {
					var functionExpression = self.getFunctionExpression(path.get('declarations', 0, 'init'));
					if (functionExpression) {
						self.transformPath(self, self.template, path, functionExpression);
					}
				}
				this.traverse(path);
			}
		});
	}
};
