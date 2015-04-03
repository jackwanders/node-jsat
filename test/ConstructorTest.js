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
			outfile = path.join(__dirname, 'fixtures/modules', filename);
			var input = fs.readFileSync(path.join(__dirname, 'fixtures/modules', 'constructor.js'), 'utf8');
			var output = jsat.transform(input);
			fs.writeFileSync(outfile, output);
			module = require('./fixtures/modules/' + filename);
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

	describe('options', function() {
		var outfile;
		var module;

		before(function() {
			var filename = utils.generateOutputFilename();
			outfile = path.join(__dirname, 'fixtures/modules', filename);
			var input = fs.readFileSync(path.join(__dirname, 'fixtures/modules', 'constructor.js'), 'utf8');
			var output = jsat.transform(input, {
				constructor: {
					force: true
				}
			});
			fs.writeFileSync(outfile, output);
			module = require('./fixtures/modules/' + filename);
		});

		after(function() {
			fs.unlink(outfile);
		});

		it('calls console.warn when options.force is false', function() {
			var stub = sinon.stub(console, 'warn');
			assert.doesNotThrow(function() {
				var thing = module.ConstructorFn();
			});
			assert.equal(stub.callCount, 1, 'expected console.warn to be called when options.force is true');
			console.warn.restore();
		});
	});

});
