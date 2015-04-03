module.exports = {
	generateOutputFilename: function() {
		return 'file_' + new Date().getTime() + '.js';
	}
};
