const fs = require('fs');
const config = require('./config');
const log4js = require('log4js');
log4js.configure(config.logging.options);
let version = require('./package.json').version;
let logger = log4js.getLogger(`[DAT ${version}]`);
logger.level = config.logging.loglevel;
global.logger = logger;

if (process.argv.length < 3) {
	console.log('Missing test file');
	process.exit();
}

const testFile = process.argv[2];

logger.info(`Using test file : ${testFile}`);

if (!fs.existsSync(testFile)) {
	logger.error(`Unable to find test file ${testFile}`);
}

const testFileData = fs.readFileSync(testFile).toString();

logger.info(testFileData);