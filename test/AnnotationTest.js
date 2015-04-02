var Annotation = require('../lib/Annotation');
var assert = require('chai').assert;
var _ = require('lodash');

describe('Annotation', function() {

	describe('constructor', function() {

		it('exists', function() {
			assert.equal(typeof Annotation, 'function', 'expected Annotation to be a function');
		});

		it('throws a SyntaxError when new keyword is not used', function() {
			assert.throws(function() {
				var a = Annotation({
					name: 'foo'
				});
			}, SyntaxError);

			assert.doesNotThrow(function() {
				var a = new Annotation({
					name: 'foo'
				});
			});
		});

		it('builds a regex containing the annotation name', function() {
			var a = new Annotation({
				name: 'foo'
			});
			assert(a.regex instanceof RegExp, 'expected .regex to be a regular expression');
			assert(a.regex.toString().indexOf('foo') >= 0, 'expected .regex to contain annotation name');
		});

		it('builds a regex containing all aliases', function() {
			var aliases = ['beep', 'boop', 'bop'];
			var a = new Annotation({
				name: 'foo',
				aliases: aliases
			});
			_.each(aliases, function(alias) {
				assert(a.regex.toString().indexOf(alias) >= 0, 'expected .regex to contain alias "' + alias + '"');
			});
		});

	});

});
