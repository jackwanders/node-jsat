var recast = require('recast');
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
 * Determine if the call expression is the 'console.warn' call containing the
 * annotation value placeholder. If so, replace the argument with the true annotation value
 */
var isAnnotationValueCallExpression = function(path) {
	var callee = path.get('callee').value;
	var arguments = path.get('arguments').value;
	return (
		callee.object &&
		callee.object.name === 'console' &&
		arguments.length &&
		arguments[0].name === placeholders.ANNOTATION_VALUE
	);
};

/**
 * Determine if the expression statement represents the function body placeholder.
 * If so, swap it for the body of the original function
 */
var isTransformedBodyPlaceholder = function(path) {
	return path.get('expression', 'name').value === placeholders.TARGET_FUNCTION_BODY;
};

module.exports = {

	/**
	 * Construct a 'Literal' node containing the annotation message
	 */
	buildValueLiteral: function(annotation, path) {
		return b.literal(annotation.getValue(path));
	},

	/**
	 * Transform the deprecated function expression using the provided AST
	 */
	transformPath: function(annotation, rootPath, functionExpression) {
		if (!functionExpression) {
			functionExpression = rootPath;
		}
		var valueLiteral = this.buildValueLiteral(annotation, rootPath);
		var originalParameters = functionExpression.get('params');
		var originalBody = functionExpression.get('body');
		var transformerAST = recast.parse(transformerTmpl);

		recast.visit(transformerAST, {

			// Inject original function arguments
			visitFunctionExpression: function(path) {
				if (isTransformedFunctionExpression(path)) {
					path.get('params').replace(originalParameters.value);
				}
				this.traverse(path);
			},

			// Inject annotation value into console.warn statement
			visitCallExpression: function(path) {
				if (isAnnotationValueCallExpression(path)) {
					path.get('arguments', 0).replace(valueLiteral);
				}
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
		functionExpression.replace(transformerAST.program.body[0].expression);
	}
};
