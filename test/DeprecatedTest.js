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
		var deprecatedFn;

		beforeEach(function() {
			var filename = utils.generateOutputFilename();
			outfile = path.join(__dirname, 'fixtures/output', filename);
			var input = fs.readFileSync(path.join(__dirname, 'fixtures/modules', 'deprecated.js'), 'utf8');
			var output = jsat.transform(input);
			fs.writeFileSync(outfile, output);
			deprecatedFn = require('./fixtures/output/' + filename);
		});

		afterEach(function() {
			deprecatedFn = null;
			fs.unlink(outfile);
		});

		it('calls console.trace when a deprecated function is called', function() {
			var stub = sinon.stub(console, 'trace');
			deprecatedFn();
			assert(stub.called);
			console.trace.restore();
		});

		it('calls console.trace once and only once when deprecated function is called multiple times', function() {
			var stub = sinon.stub(console, 'trace');
			deprecatedFn();
			deprecatedFn();
			assert.equal(stub.callCount, 1);
			console.trace.restore();
		});

		it('falls back to console.warn if console.trace doesn\'t exist', function() {
			console.trace = null;
			var stub = sinon.stub(console, 'warn');
			deprecatedFn();
			assert(stub.called);
			console.warn.restore();
		});

	});

});
