const config = require("./config")
const log4js = require("log4js")
log4js.configure(config.logging.options)
let version = require("./package.json").version
let logger = log4js.getLogger(`[DAT ${version}]`)
logger.level = config.logging.loglevel
global.logger = logger

const db = require('./db.client');
const generator = require('./generator');

let data = require('./data.json');

(async () => {
	await db.init()
	await db.clearDataservice({ name: data.name, app: data.app })
	generator.generateSampleData(data)
})();