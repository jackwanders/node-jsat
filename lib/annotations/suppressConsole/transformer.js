var recast = require('recast');

module.exports = {

	/**
	 * Transform the function by removing all calls to console
	 */
	transformPath: function(annotation, rootPath, functionExpression) {
		if (!functionExpression) {
			functionExpression = rootPath;
		}

		recast.visit(functionExpression, {
			visitCallExpression: function(path) {
				var callee = path.get('callee').value;
				if (
					callee.object &&
					callee.object.name === 'console'
				) {
					path.parentPath.replace(null);
				}
				this.traverse(path);
			}
		});
	}

};
