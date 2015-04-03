module.exports = function(grunt) {

	// Loads any modules starting with 'grunt-'
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		coveralls: {
			options: {
				force: true
			},
			travis: {
				src: 'coverage/lcov.info'
			}
		},

		// Run a check-style task against scripts (uses jsxcs)
		jscs: {

			all: {
				config: '.jscsrc',
				files: [{
					expand: true,
					cwd: 'lib',
					src: ['**/*.js', '!**/*.tmpl.js']
				}]
			}

		},

		// Lint scripts for bad coding habits (uses jsxHint)
		jshint: {

			options: {
				jshintrc: '.jshintrc'
			},

			all: {
				files: [{
					expand: true,
					cwd: 'lib',
					src: ['**/*.js', '!**/*.tmpl.js']
				}]
			}
		}
	});

	grunt.registerTask('checkcode', 'Checks code for quality', [
		'jshint:all',
		'jscs:all'
	]);
};
