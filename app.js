
const express = require("express")
let app = express()
let port = process.env.PORT || 8080

const config = require("./config")
const log4js = require("log4js")
log4js.configure(config.logging.options)
let version = require("./package.json").version
let logger = log4js.getLogger(`[DAT ${version}]`)
logger.level = config.logging.loglevel
global.logger = logger

// const db = require('./db.client');
// const generator = require('./generator');

// let data = require('./data.json');

// (async () => {
// 	await db.init()
// 	await db.clearDataservice({ name: data.name, app: data.app })
// 	generator.generateSampleData(data)
// })();

let environmentRouter = require("./routes/environment.routes")
let datasetRouter = require("./routes/datasets.routes")
let testRouter = require("./routes/test.routes")
let resultsRouter = require("./routes/results.routes")

app.use(express.json())
app.use((_req, _res, _next) => {
	logger.info(`${_req.method} ${_req.path}`)
	_next()
})
app.use("/api/environment", environmentRouter);
app.use("/api/dataset", datasetRouter);
app.use("/api/tests", testRouter);
app.use("/api/results", resultsRouter);

// Mongoose.set("debug", "true")

app.listen(port, () => {
	logger.info("Server started on port " + port)
})