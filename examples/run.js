var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var jsat = require('../index');

var examples = [
	'constructor', 'deprecated'
];

_.each(examples, function(dir) {
	require('./' + dir + '/runner')();
});
