var recast = require('recast');
var annotations = require('./lib/annotations');

module.exports = {
	transform: function(source, options) {
		var ast = recast.parse(source);
		annotations.enact(ast, options);
		return recast.print(ast).code;
	}
};
