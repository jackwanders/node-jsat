var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var jsat = require('../index');

var examples = [
	'constructor', 'deprecated', 'param'
];

_.each(examples, function(dir) {
	require('./' + dir + '/runner')();
});
