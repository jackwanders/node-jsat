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
			});
			describe('when options.logger === \'info\'', function() {
				var dest;
				var module;
				before(function() {
					dest = utils.generateDestination();
					module = utils.createModule('deprecated', type, dest, {
						deprecated: {
							logger: 'info'
						}
					});
				});
				after(function() {
					fs.unlink(dest);
				});
				it('calls console.info instead of the default console.trace', function() {
					utils.assertConsoleCalls({
						method: 'info',
						callCount: 1,
						fn: function() {
							module.beep();
						}
					});
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
