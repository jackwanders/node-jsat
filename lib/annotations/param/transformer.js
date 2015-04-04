var _ = require('lodash');
var recast = require('recast');

/**
 * parse a JSDoc param annotation value into
 * a hash containing the parameter's name and expected type
 * e.g. "{number} foo" should map to { name: 'foo', type: 'number' }
 */
var parseParamValue = function(value) {
	var regex = /^\{(.*)\}\s+(.*)\b/;
	var match = value.match(regex);
	return {
		name: match[2],
		type: match[1]
	};
};

var generateParamTypeMap = function(annotation, rootPath) {
	var values = annotation.getValue(rootPath);
	var map = {};
	if (typeof values === 'string') {
		values = [values];
	}
	_.each(values, function(value) {
		var data = parseParamValue(value);
		map[data.name] = data.type;
	});
	return map;
};

var generateParamNameList = function(functionExpression) {
	return _.pluck(functionExpression.value.params, 'name');
};

var injectParameterData = function(ast, mapAST, listAST) {
	recast.visit(ast, {

		// find the identifier for the parameter list and map and swap it for the array expression
		visitIdentifier: function(path) {
			if (path.get('name').value === '__param_type_map__') {
				path.parentPath.get('init').replace(mapAST);
			}
			if (path.get('name').value === '__param_name_list__') {
				path.parentPath.get('init').replace(listAST);
			}
			this.traverse(path);
		}

	});
};

var convertLiteralToExpression = function(obj) {
	var str = 'var foo = ' + JSON.stringify(obj) + ';';
	var ast = recast.parse(str).program.body[0];
	return ast.declarations[0].init;
};

module.exports = {
	transformPath: function(annotation, ast, rootPath, functionExpression) {
		var paramTypeMap = generateParamTypeMap(annotation, rootPath);
		var paramNameList = generateParamNameList(functionExpression);
		var mapAST = convertLiteralToExpression(paramTypeMap);
		var listAST = convertLiteralToExpression(paramNameList);

		injectParameterData(ast, mapAST, listAST);
	}
};
