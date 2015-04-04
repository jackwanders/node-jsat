var jsat = require('../index');
var assert = require('chai').assert;
var sinon = require('sinon');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var recast = require('recast');
var utils = require('./utils');

describe('Deprecated Annotation', function() {

	describe('transformed function', function() {

		var outfile;
		var module;

		beforeEach(function() {
			var filename = utils.generateOutputFilename();
			outfile = path.join(__dirname, 'fixtures/modules', filename);
			var input = fs.readFileSync(path.join(__dirname, 'fixtures/modules', 'deprecated.js'), 'utf8');
			var output = jsat.transform(input);
			fs.writeFileSync(outfile, output);
			module = require('./fixtures/modules/' + filename);
		});

		afterEach(function() {
			module = null;
			fs.unlink(outfile);
		});

		it('calls console.trace when a deprecated function is called', function() {
			var stub = sinon.stub(console, 'trace');
			module.add(1, 2);
			module.subtract(3,2);
			assert.equal(stub.callCount, 2, 'expected console.trace to be called for each method');
			console.trace.restore();
		});

		it('calls console.trace once and only once when deprecated function is called multiple times', function() {
			var stub = sinon.stub(console, 'trace');
			module.add(1, 2);
			module.add(3, 4);
			assert.equal(stub.callCount, 1, 'expected console.trace to only be called once');
			console.trace.restore();
		});

		it('falls back to console.warn if console.trace doesn\'t exist', function() {
			console.trace = null;
			var stub = sinon.stub(console, 'warn');
			module.subtract(4, 3);
			assert(stub.called, 'expected function to fall back to console.warn');
			console.warn.restore();
		});

	});

});
