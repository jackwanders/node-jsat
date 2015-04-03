var jsat = require('../index');
var assert = require('chai').assert;
var sinon = require('sinon');
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var recast = require('recast');
var utils = require('./utils');

describe('Param Annotation', function() {

	describe('transformed function', function() {

		var outfile;
		var module;

		beforeEach(function() {
			var filename = utils.generateOutputFilename();
			outfile = path.join(__dirname, 'fixtures/modules', filename);
			var input = fs.readFileSync(path.join(__dirname, 'fixtures/modules', 'param.js'), 'utf8');
			var output = jsat.transform(input);
			fs.writeFileSync(outfile, output);
			module = require('./fixtures/modules/' + filename);
		});

		afterEach(function() {
			module = null;
			fs.unlink(outfile);
		});

		it('works properly when parameters have the proper type', function() {
			var stub = sinon.stub(console, 'warn');
			module.add(1, 2);
			module.multBy2(18);
			assert.equal(stub.callCount, 0);
			console.warn.restore();
		});

		it('will warn when a parameter has a type mismatch', function() {
			var stub = sinon.stub(console, 'warn');
			module.add('3', 4);
			assert.equal(stub.callCount, 1);
			console.warn.restore();
		});

		it('warns for every mismatched argument', function() {
			var stub = sinon.stub(console, 'warn');
			module.add('3', {foo:3});
			assert.equal(stub.callCount, 2);
			console.warn.restore();
		});

	});

});
