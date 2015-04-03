var jsat = require('../index');
var assert = require('chai').assert;
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var recast = require('recast');

describe('jsat API', function() {

	describe('.transforms', function() {

		it('is a function', function() {
			assert.equal(typeof jsat.transform, 'function', 'expected jsat.transform to be a function');
		});

		it('leaves unannotated source untouched', function() {
			var input = fs.readFileSync(path.join(__dirname, 'fixtures/modules', 'plain.js'), 'utf8');
			var output = jsat.transform(input);
			assert.equal(output, input, 'expected unannotated source to pass through jsat untouched');
		});

		it('transforms @param annotated code', function() {
			var input = fs.readFileSync(path.join(__dirname, 'fixtures/modules', 'param.js'), 'utf8');
			var output = jsat.transform(input);
			assert.notEqual(output, input, 'expected constructor source to be transformed by jsat');
		});

		it('transforms code with multiple annotations', function() {
			var input = fs.readFileSync(path.join(__dirname, 'fixtures/modules', 'multi.js'), 'utf8');
			var output = jsat.transform(input);
			assert.notEqual(output, input, 'expected jsat to successfully transform code with multiple annotations');
		});

		it('transforms IIFEs', function() {
			var input = fs.readFileSync(path.join(__dirname, 'fixtures/modules', 'iife.js'), 'utf8');
			var output = jsat.transform(input);
			assert.notEqual(output, input, 'expected jsat to successfully transform code with multiple annotations');
		});

		it('does not transform node if type does not match type of annotation', function() {
			var input = fs.readFileSync(path.join(__dirname, 'fixtures/modules', 'annotatedLiteral.js'), 'utf8');
			var output = jsat.transform(input);
			assert.equal(output, input, 'expected annotated literal to remain unmodified');
		});

	});

});
