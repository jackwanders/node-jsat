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

		it('transforms @deprecated annotated code', function() {
			var input = fs.readFileSync(path.join(__dirname, 'fixtures/modules', 'deprecated.js'), 'utf8');
			var output = jsat.transform(input);
			assert.notEqual(output, input, 'expected deprecated source to be transformed by jsat');
		});

		it('transforms @constructor annotated code', function() {
			var input = fs.readFileSync(path.join(__dirname, 'fixtures/modules', 'constructor.js'), 'utf8');
			var output = jsat.transform(input);
			assert.notEqual(output, input, 'expected constructor source to be transformed by jsat');
		});

	});

});
