var recast = require('recast');
var n = recast.types.namedTypes;
var b = recast.types.builders;
var placeholders = require('../../placeholders');

var getFunctionName = function(path) {
	if (n.VariableDeclaration.check(path.node)) {
		return path.get('declarations', 0, 'id', 'name').value;
	}
	if (n.FunctionDeclaration.check(path.node)) {
		return path.get('id', 'name').value;
	}
	return null;
};

var injectOriginalParameters = function(ast, parameters) {
	var injectParams = function(path) {
		var params = path.get('params');
		if (
			params.value.length === 1 &&
			params.get(0, 'name').value === placeholders.TARGET_FUNCTION_PARAMETERS
		) {
			path.get('params').replace(parameters.value);
		}
		this.traverse(path);
	};

	recast.visit(ast, {
		visitFunctionExpression: injectParams,
		visitFunctionDeclaration: injectParams
	});
};

var injectOriginalFunctionName = function(ast, name) {
	recast.visit(ast, {
		visitIdentifier: function(path) {
			if (path.get('name').value === placeholders.TARGET_VARIABLE_NAME) {
				path.value.name = name;
			}
			this.traverse(path);
		},

		visitLiteral: function(path) {
			if (typeof path.value.value === 'string' && path.value.value.indexOf(placeholders.TARGET_VARIABLE_NAME) >= 0) {
				path.replace(b.literal(path.value.value.replace(placeholders.TARGET_VARIABLE_NAME, name)));
			}
			this.traverse(path);
		}
	});
};

var injectOriginalBody = function(ast, body) {
	recast.visit(ast, {
		visitExpressionStatement: function(path) {
			if (path.get('expression', 'name').value === placeholders.TARGET_FUNCTION_BODY) {
				path.replace(body.value);
			}
			this.traverse(path);
		}
	});
};

var injectValueLiteral = function(ast, literal) {
	recast.visit(ast, {
		visitCallExpression: function(path) {
			var callee = path.get('callee').value;
			var arguments = path.get('arguments').value;
			if (
				callee.object &&
				callee.object.name === 'console' &&
				arguments.length &&
				arguments[0].name === placeholders.ANNOTATION_VALUE
			) {
				path.get('arguments', 0).replace(literal);
			}
			this.traverse(path);
		}
	});
};

module.exports = {

	/**
	 * Construct a 'Literal' node containing the annotation message
	 */
	buildValueLiteral: function(annotation, path) {
		var value = annotation.getValue(path);
		if (!value) {
			return null;
		}
		return b.literal(annotation.getValue(path));
	},

	/**
	 * Transform the deprecated function expression using the provided AST
	 */
	transformPath: function(annotation, tmpl, rootPath, functionExpression) {
		if (!functionExpression) {
			functionExpression = rootPath;
		}

		var transformerAST = recast.parse(tmpl);
		var originalFunctionName = getFunctionName(rootPath);
		var valueLiteral = this.buildValueLiteral(annotation, rootPath);
		var originalParameters = functionExpression.get('params');
		var originalBody = functionExpression.get('body');

		injectOriginalFunctionName(transformerAST, originalFunctionName);
		injectOriginalParameters(transformerAST, originalParameters);
		injectOriginalBody(transformerAST, originalBody);
		injectValueLiteral(transformerAST, valueLiteral);


		functionExpression.replace(transformerAST.program.body[0]);
	}
};
