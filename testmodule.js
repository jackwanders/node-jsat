/**
 * The following is a source file used to test the annotation transformer
 */

/**
 * @deprecated testmodule.exportFoo is deprecated in favor of testmodule.exportBar
 * another comment
 */
var foo = function(firstArgument, secondArgument) {
	console.log('\nadding ' + firstArgument + ' and ' + secondArgument);
	// inside comment
	return firstArgument + secondArgument;
};

/**
 * asdf
 * asdf
 *
 */
function bar(a, b) {
	console.log('\nmultiplying ' + a + ' by 3, then adding ' + b);
	var x = a * 3;
	return x + b;
}


module.exports = {
	exportFoo: foo,
	exportBar: bar
};
