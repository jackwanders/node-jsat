var recast = require('recast');
var n = recast.types.namedTypes;
var transformer = require('./transformers/function');

/**
 * Annotation methods for annotations that target functions. This
 * includes both function declarations and function expressions that are part
 * of variable declarations.
 */
module.exports = {

	getFunctionExpressionFromVariableDeclaration: function(path) {
		var declaration = path.get('declarations', 0, 'init');

		// If the variable declaration is assigning a function expression
		// to a variable, return the declaration value
		if (n.FunctionExpression.check(declaration.node)) {
			return declaration;
		}

		// If the declaration is assigning an IIFE that returns
		// a function expression, return true
		if (n.CallExpression.check(declaration.node)) {
			var variables = {};
			var finalReturnValue;

			// visit the declaration, storing a list of all variable values
			// When we get to the final return statement, check to see
			// if it's either a function expression or a variable containing one
			recast.visit(declaration, {
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
					self.transformPath(self, self.template, path);
				}
				this.traverse(path);
			},
			visitVariableDeclaration: function(path) {
				if (self.pathIsAnnotated(path)) {
					var functionExpression = self.getFunctionExpressionFromVariableDeclaration(path);
					if (functionExpression) {
						self.transformPath(self, self.template, path, functionExpression);
					}
				}
				this.traverse(path);
			}
		});
	}
};
