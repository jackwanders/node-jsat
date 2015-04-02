var fs = require('fs');
var jsat = require('./index');

// module to transform
var infile = __dirname + '/testmodule.js';
var outfile = __dirname + '/dist/testmodule.js';

var source = fs.readFileSync(infile, 'utf8');
var output = jsat.transform(source);

fs.writeFileSync(outfile, output);
