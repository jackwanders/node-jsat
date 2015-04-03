var recast = require('recast');
var n = recast.types.namedTypes;
var b = recast.types.builders;
var _ = require('lodash');
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
			params.get(0, 'name').value === placeholders.ORIGINAL_PARAMETERS
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
			if (path.get('name').value === placeholders.ORIGINAL_ID) {
				path.value.name = name;
			}
			this.traverse(path);
		},

		visitLiteral: function(path) {
			if (typeof path.value.value === 'string' && path.value.value.indexOf(placeholders.ORIGINAL_ID) >= 0) {
				path.replace(b.literal(path.value.value.replace(placeholders.ORIGINAL_ID, name)));
			}
			this.traverse(path);
		}
	});
};

var injectOriginalBody = function(ast, body) {
	recast.visit(ast, {
		visitExpressionStatement: function(path) {
			if (path.get('expression', 'name').value === placeholders.ORIGINAL_BODY) {
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
			var args = path.get('arguments').value;
			if (
				callee.object &&
				callee.object.name === 'console' &&
				args.length &&
				args[0].name === placeholders.ANNOTATION_VALUE
			) {
				path.get('arguments', 0).replace(literal);
			}
			this.traverse(path);
		}
	});
};

var getOptionValue = function(options, identifier) {
	return options[identifier.match(/__options_(.*)__/)[1]];
};

var injectOptions = function(ast, options) {
	recast.visit(ast, {
		visitIdentifier: function(path) {
			if (path.get('name').value.indexOf('__options_') === 0) {
				var optionValue = getOptionValue(options, path.get('name').value);
				path.replace(recast.parse(JSON.stringify(optionValue)));
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

		if (typeof value !== 'string') {
			return _.map(value, b.literal).join(' | ');
		}
		return b.literal(value);
	},

	/**
	 * Transform the deprecated function expression using the provided AST
	 */
	transformPath: function(annotation, ast, rootPath, functionExpression) {

		var originalFunctionName = getFunctionName(rootPath);
		var valueLiteral = this.buildValueLiteral(annotation, rootPath);
		var originalParameters = functionExpression.get('params');
		var originalBody = functionExpression.get('body');

		injectOriginalFunctionName(ast, originalFunctionName);
		injectOriginalParameters(ast, originalParameters);
		injectOriginalBody(ast, originalBody);
		injectValueLiteral(ast, valueLiteral);
		injectOptions(ast, annotation.options);

		_.each(annotation.customTransformers, function(transformer) {
			transformer.transformPath(annotation, ast, rootPath, functionExpression);
		});

		functionExpression.replace(ast.program.body[0]);
	}
};
