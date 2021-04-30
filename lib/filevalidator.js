const fs = require('fs');

module.exports = (_filePath) => {
	try {
		if (!fs.existsSync(_filePath)) {
			throw Error(`Unable to find test file ${_filePath}`);
		}

		const fileData = JSON.parse(fs.readFileSync(_filePath).toString());

		if (!fileData.url) throw Error(`No URL found in ${_filePath}`);

	} catch (error) {
		console.log(error.message);
		process.exit();
	}
};