var recast = require('recast');
var n = recast.types.namedTypes;
var b = recast.types.builders;
var fs = require('fs');
var transformerTmpl = fs.readFileSync(__dirname + '/transformer.tmpl', 'utf8');
var placeholders = require('../placeholders');

/**
 * Determine if the current function expression contains the placeholder parameter
 * If so, replace it with those of the original function
 */
var isTransformedFunctionExpression = function(path) {
	var params = path.get('params');
	return (
		params.value.length === 1 &&
		params.get(0, 'name').value === placeholders.TARGET_FUNCTION_ARGUMENTS
	);
};

/**
 * Determine if the expression statement represents the function body placeholder.
 * If so, swap it for the body of the original function
 */
var isTransformedBodyPlaceholder = function(path) {
	return path.get('expression', 'name').value === placeholders.TARGET_FUNCTION_BODY;
};

/**
 * Obtain name of constructor from either the variable declaration or the
 * function declaration
 */
var getConstructorName = function(path) {
	if (n.VariableDeclaration.check(path.node)) {
		return path.get('declarations', 0, 'id', 'name').value;
	}
	if (n.FunctionDeclaration.check(path.node)) {
		return path.get('id', 'name').value;
	}
	throw new Error('Cannot apply constructor annotation to this node');
};

module.exports = {

	/**
	 * Transform the deprecated function expression using the provided AST
	 */
	transformPath: function(annotation, rootPath, functionExpression) {
		if (!functionExpression) {
			functionExpression = rootPath;
		}

		var constructorName = getConstructorName(rootPath);
		var originalParameters = functionExpression.get('params');
		var originalBody = functionExpression.get('body');
		var transformerAST = recast.parse(transformerTmpl);

		recast.visit(transformerAST, {

			visitFunctionDeclaration: function(path) {
				if (isTransformedFunctionExpression(path)) {
					path.get('params').replace(originalParameters.value);
				}
				this.traverse(path);
			},

			visitIdentifier: function(path) {
				if (path.get('name').value === placeholders.TARGET_VARIABLE_NAME) {
					path.value.name = constructorName;
				}
				this.traverse(path);
			},

			visitLiteral: function(path) {
				if (path.value.value.indexOf(placeholders.TARGET_VARIABLE_NAME) >= 0) {
					path.replace(b.literal(path.value.value.replace(placeholders.TARGET_VARIABLE_NAME, constructorName)));
				}
				this.traverse(path);
			},

			// Inject constructor name where necessary
			visitCallExpression: function(path) {
				/*if (isAnnotationValueCallExpression(path)) {
					path.get('arguments', 0).replace(valueLiteral);
				}*/
				this.traverse(path);
			},

			// Inject original function body
			visitExpressionStatement: function(path) {
				if (isTransformedBodyPlaceholder(path)) {
					path.replace(originalBody.value);
				}
				this.traverse(path);
			}
		});

		functionExpression.replace(transformerAST.program.body[0]);
	}
};
