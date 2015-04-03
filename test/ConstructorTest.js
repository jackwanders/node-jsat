var jsat = require('../index');
var assert = require('chai').assert;
var sinon = require('sinon');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var recast = require('recast');
var utils = require('./utils');

describe('Constructor Annotation', function() {

	describe('transformed function', function() {

		var outfile;
		var module;

		beforeEach(function() {
			var filename = utils.generateOutputFilename();
			outfile = path.join(__dirname, 'fixtures/output', filename);
			var input = fs.readFileSync(path.join(__dirname, 'fixtures/modules', 'constructor.js'), 'utf8');
			var output = jsat.transform(input);
			fs.writeFileSync(outfile, output);
			module = require('./fixtures/output/' + filename);
		});

		afterEach(function() {
			module = null;
			fs.unlink(outfile);
		});

		it('works properly when new keyword is used on a @constructor annotated function', function() {
			assert.doesNotThrow(function() {
				var thing = new module.ConstructorFn();
			});
		});

		it('works properly when new keyword is used on a @class annotated function', function() {
			assert.doesNotThrow(function() {
				var thing = new module.ClassFn();
			});
		});

		it('throws a SyntaxError when the new keyword is omitted', function() {
			assert.throws(function() {
				var thing = module.ConstructorFn();
			}, SyntaxError);
			assert.throws(function() {
				var thing = module.ClassFn();
			}, SyntaxError);
		});

	});

});
