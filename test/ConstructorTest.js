var fs = require('fs');
var utils = require('./utils');
var assert = require('chai').assert;

describe('Constructor Annotation', function() {

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
					module = utils.createModule('constructor', type, dest);
				});
				after(function() {
					fs.unlink(dest);
				});
				it('doesn\'t throw when new keyword is used', function() {
					assert.doesNotThrow(function() {
						var car = new module.Car();
					}, SyntaxError);
					assert.doesNotThrow(function() {
						var truck = new module.Truck();
					}, SyntaxError);
				});
				it('throws a SyntaxError when new keyword is missing', function() {
					assert.throws(function() {
						var car = module.Car();
					}, SyntaxError);
					assert.throws(function() {
						var truck = module.Truck();
					}, SyntaxError);
				});
			});
			describe('when options.force === true', function() {
				var dest;
				var module;
				before(function() {
					dest = utils.generateDestination();
					module = utils.createModule('constructor', type, dest, {
						constructor: {
							force: true
						}
					});
				});
				after(function() {
					fs.unlink(dest);
				});
				it('calls console.warn', function() {
					utils.assertConsoleCalls({
						method: 'warn',
						callCount: 1,
						fn: function() {
							var car = module.Car();
						}
					});
					utils.assertConsoleCalls({
						method: 'warn',
						callCount: 1,
						fn: function() {
							var truck = module.Truck();
						}
					});
				});
			});
			describe('when disabled by options', function() {
				var dest;
				var module;
				before(function() {
					dest = utils.generateDestination();
					module = utils.createModule('constructor', type, dest, {
						constructor: false
					});
				});
				after(function() {
					fs.unlink(dest);
				});
				it('does not call console.warn', function() {
					utils.assertConsoleCalls({
						method: 'warn',
						callCount: 0,
						fn: function() {
							var car = module.Car();
						}
					});
					utils.assertConsoleCalls({
						method: 'warn',
						callCount: 0,
						fn: function() {
							var truck = module.Truck();
						}
					});
				});
			});
		});
	});
});
