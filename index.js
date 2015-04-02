var recast = require('recast');
var annotations = require('./lib/annotations');

module.exports = {
	transform: function(source) {
		var ast = recast.parse(source);
		annotations.enact(ast);
		return recast.print(ast).code;
	}
};
