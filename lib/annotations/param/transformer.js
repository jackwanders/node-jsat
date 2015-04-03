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

var generateParameterList = function(annotation, rootPath) {
	var values = annotation.getValue(rootPath);
	if (typeof values === 'string') {
		values = [values];
	}
	return _.map(values, parseParamValue);
};

var injectParameterList = function(ast, listAST) {
	recast.visit(ast, {

		// find the identifier for the parameter list and swap it for the array expression
		visitIdentifier: function(path) {
			if (path.get('name').value === '__parameter_list__') {
				path.parentPath.get('init').replace(listAST);
			}
			this.traverse(path);
		}

	});
};

module.exports = {
	transformPath: function(annotation, ast, rootPath) {
		var parameterList = generateParameterList(annotation, rootPath);
		var listAST = recast.parse(JSON.stringify(parameterList)).program.body[0];

		injectParameterList(ast, listAST);
	}
};
