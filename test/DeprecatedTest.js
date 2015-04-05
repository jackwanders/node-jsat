var fs = require('fs');
var utils = require('./utils');

describe('Deprecated Annotation', function() {

	var affectedNodes = [
		'variableDeclaration',
		'functionDeclaration',
		'property'
	];

	affectedNodes.forEach(function(type) {
		describe('node type: ' + type, function() {
			describe('with default options', function() {
				var dest;
				var module;
				before(function() {
					dest = utils.generateDestination();
					module = utils.createModule('deprecated', type, dest);
				});
				after(function() {
					fs.unlink(dest);
				});
				it('calls console.trace when deprecated function is called', function() {
					utils.assertConsoleCalls({
						method: 'trace',
						callCount: 1,
						fn: function() {
							module.beep();
						}
					});
				});
				it('falls back to console.warn when console.trace isn\'t found', function() {
					_trace = console.trace;
					console.trace = null;
					utils.assertConsoleCalls({
						method: 'warn',
						callCount: 1,
						fn: function() {
							module.beep();
						}
					});
					console.trace = _trace;
				});
			});
			describe('when disabled by options', function() {
				var dest;
				var module;
				before(function() {
					dest = utils.generateDestination();
					module = utils.createModule('deprecated', type, dest, {
						deprecated: false
					});
				});
				after(function() {
					fs.unlink(dest);
				});
				it('does nothing', function() {
					utils.assertConsoleCalls({
						method: 'trace',
						callCount: 0,
						fn: function() {
							module.beep();
						}
					});
				});
			});
		});
	});
});
