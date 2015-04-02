var Annotation = require('../lib/Annotation');
var assert = require('chai').assert;
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var recast = require('recast');

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
	});

	describe('annotation detection', function() {

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

		it('detects existence of annotation JSDoc comments', function() {
			var a = new Annotation({
				name: 'foo',
				type: 'function'
			});
			var goodComments = [
				'/** @foo */',
				'/**\n * @foo\n */'
			];
			_.each(goodComments, function(comment) {
				var val = recast.parse(comment).program.comments[0].value;
				assert(a.commentContainsAnnotation(val), 'expected annotation to detect existence of @foo in ' + comment);
			});
		});

		it('detects annotation aliases', function() {
			var a = new Annotation({
				name: 'foo',
				aliases: ['beep', 'boop', 'bop'],
				type: 'function'
			});
			var goodComments = [
				'/** @beep */',
				'/**\n * @beep\n */',
				'/** @boop */',
				'/**\n * @boop\n */',
				'/** @bop */',
				'/**\n * @bop\n */',
			];
			_.each(goodComments, function(comment) {
				var val = recast.parse(comment).program.comments[0].value;
				assert(a.commentContainsAnnotation(val), 'expected annotation to detect existence of @foo in ' + comment);
			});
		});

		it('ignores non JSDoc comments', function() {
			var a = new Annotation({
				name: 'foo',
				type: 'function'
			});
			var badComments = [
				'// @foo',
				'/* @foo */',
				'/*\n @foo\n */'
			];
			_.each(badComments, function(comment) {
				var val = recast.parse(comment).program.comments[0].value;
				assert.isFalse(a.commentContainsAnnotation(val), 'expected annotation to ignore ' + comment);
			});
		});

		it('ignores other annotations', function() {
			var a = new Annotation({
				name: 'foo',
				type: 'function'
			});
			var badComments = [
				'/** @bar */',
				'/**\n * @foobar\n */'
			];
			_.each(badComments, function(comment) {
				var val = recast.parse(comment).program.comments[0].value;
				assert.isFalse(a.commentContainsAnnotation(val), 'expected annotation to ignore ' + comment);
			});
		});

	});

	describe('annotation value retrieval', function() {
		it('retrieves annotation value from comments', function() {
			var a = new Annotation({
				name: 'foo',
				type: 'function',
				defaultValue: 'baz'
			});
			var commentsWithValues = [
				'/**\n * @foo bar\n */',
				'/** @foo bar */'
			];
			_.each(commentsWithValues, function(comment) {
				var val = recast.parse(comment).program.comments[0].value;
				assert.equal(a.getAnnotationValueFromComment(val), 'bar', 'expected annotation to retrieve "bar" from ' + comment);
			});
		});

		it('returns default value if no value is found alongside annotation', function() {
			var a = new Annotation({
				name: 'foo',
				type: 'function',
				defaultValue: 'bar'
			});
			var commentsWithValues = [
				'/**\n * @foo\n */',
				'/** @foo */'
			];
			_.each(commentsWithValues, function(comment) {
				var val = recast.parse(comment).program.comments[0].value;
				assert.equal(a.getAnnotationValueFromComment(val), 'bar', 'expected annotation to return default annotation value for ' + comment);
			});
		});

		it('trims whitespace around annotation values', function() {
			var a = new Annotation({
				name: 'foo',
				type: 'function',
				defaultValue: 'baz'
			});
			var commentsWithValues = [
				'/**\n * @foo      bar     \n */',
				'/** @foo 		bar		 */'
			];
			_.each(commentsWithValues, function(comment) {
				var val = recast.parse(comment).program.comments[0].value;
				assert.equal(a.getAnnotationValueFromComment(val), 'bar', 'expected annotation to retrieve "bar" from ' + comment);
			});
		});
	});

});
