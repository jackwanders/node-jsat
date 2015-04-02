var recast = require('recast');
var n = recast.types.namedTypes;

var transformer = require('./transformers/function');

/**
 * Annotation methods for annotations that target functions. This
 * includes both function declarations and function expressions that are part
 * of variable declarations.
 */
module.exports = {

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
					transformer.transformPath(self, self.template, path);
				}
				this.traverse(path);
			},
			visitVariableDeclaration: function(path) {
				if (self.pathIsAnnotated(path) && self.variableDeclarationContainsFunctionExpression(path)) {
					transformer.transformPath(self, self.template, path, path.get('declarations', 0, 'init'));
				}
				this.traverse(path);
			}
		});
	}
};
