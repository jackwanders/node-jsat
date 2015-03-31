var fs = require('fs');
var _ = require('lodash');
var recast = require('recast');
var n = recast.types.namedTypes;

var annotations = require('./lib/annotations');

// module to transform
var infile = __dirname + '/testmodule.js';
var outfile = __dirname + '/dist/testmodule.js';

var moduleAST = recast.parse(fs.readFileSync(infile, 'utf8'));

annotations.enact(moduleAST);

fs.writeFileSync(outfile, recast.print(moduleAST).code);
