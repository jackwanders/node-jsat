var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var jsat = require('../index');

var examples = [
	'constructor', 'deprecated', 'param'
];

_.each(examples, function(dir) {
	var source = fs.readFileSync(path.join(__dirname, dir, 'source.js'), 'utf8');
	var output = jsat.transform(source);
	fs.writeFile(path.join(__dirname, dir, 'output.js'), output);
});
