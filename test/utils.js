var fs = require('fs');
var path = require('path');
var sinon = require('sinon');
var assert = require('chai').assert;
var jsat = require('../index');

// Create a 'unique' filename in which to write jsat output
var generateUniqueFilename = function() {
	return 'file_' + new Date().getTime() + '.js';
};

module.exports = {

	// Create a unique destination path within the fixtures directory
	generateDestination: function() {
		var filename = generateUniqueFilename();
		return path.join(__dirname, 'fixtures', filename);
	},

	createModule: function(node, type, dest, options) {
		var input = fs.readFileSync(
			path.join(__dirname, 'fixtures/modules/', node,  type + '.js'), 'utf8'
		);
		var output = jsat.transform(input, options);
		fs.writeFileSync(dest, output);
		return require('./fixtures/' + path.basename(dest));
	},

	// Helper method for asserting number of calls to a console method
	assertConsoleCalls: function(config) {
		var stub = sinon.stub(console, config.method);
		config.fn();
		assert.equal(stub.callCount, config.callCount, 'expected console.' + config.method + ' to be called ' + config.callCount + ' time' + config.CallCount === 1 ? '' : 's');
		console[config.method].restore();
	}
};
