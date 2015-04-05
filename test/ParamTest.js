var fs = require('fs');
var utils = require('./utils');
var assert = require('chai').assert;

describe('Param Annotation', function() {

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
					module = utils.createModule('param', type, dest);
				});
				after(function() {
					fs.unlink(dest);
				});
				it('doesn\'t warn when parameters have expected types', function() {
					utils.assertConsoleCalls({
						method: 'warn',
						callCount: 0,
						fn: function() {
							module.add(1, 2);
						}
					});
					utils.assertConsoleCalls({
						method: 'warn',
						callCount: 0,
						fn: function() {
							module.twice(1);
						}
					});
					utils.assertConsoleCalls({
						method: 'warn',
						callCount: 0,
						fn: function() {
							module.combine('1', 2);
						}
					});
				});
				it('calls console.warn when there is a type mismatch', function() {
					utils.assertConsoleCalls({
						method: 'warn',
						callCount: 1,
						fn: function() {
							module.add('1', 2);
						}
					});
					utils.assertConsoleCalls({
						method: 'warn',
						callCount: 1,
						fn: function() {
							module.twice('1');
						}
					});
					utils.assertConsoleCalls({
						method: 'warn',
						callCount: 1,
						fn: function() {
							module.combine(1, 2);
						}
					});
				});
			});
			describe('when options.force === false', function() {
				var dest;
				var module;
				before(function() {
					dest = utils.generateDestination();
					module = utils.createModule('param', type, dest, {
						param: {
							force: false
						}
					});
				});
				after(function() {
					fs.unlink(dest);
				});
				it('throws a TypeError when there is a type mismatch', function() {
					assert.throws(function() {
						module.add('1', 2);
					});
					assert.throws(function() {
						module.twice('1');
					});
					assert.throws(function() {
						module.combine(1, 2);
					});
				});
			});
			describe('when disabled by options', function() {
				var dest;
				var module;
				before(function() {
					dest = utils.generateDestination();
					module = utils.createModule('param', type, dest, {
						param: false
					});
				});
				after(function() {
					fs.unlink(dest);
				});
				it('doesn\'t call console.warn when there is a type mismatch', function() {
					utils.assertConsoleCalls({
						method: 'warn',
						callCount: 0,
						fn: function() {
							module.add('1', 2);
						}
					});
					utils.assertConsoleCalls({
						method: 'warn',
						callCount: 0,
						fn: function() {
							module.twice('1');
						}
					});
					utils.assertConsoleCalls({
						method: 'warn',
						callCount: 0,
						fn: function() {
							module.combine(1, 2);
						}
					});
				});
			});
		});
	});
});
