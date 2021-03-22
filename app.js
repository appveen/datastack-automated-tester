
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

const db = require('./lib/db.client');
// const generator = require('./generator');

// let data = require('./data.json');

let environmentRouter = require("./routes/environment.routes")
let datasetRouter = require("./routes/datasets.routes")
let testRouter = require("./routes/test.routes")
let resultsRouter = require("./routes/results.routes")
let userRouter = require("./routes/user.routes")

let checkSession = require('./lib/api.client').check

app.use(express.json())
app.use((_req, _res, _next) => {
	logger.info(`${_req.method} ${_req.path}`)
	_next()
})
app.use("/api/user", userRouter);

app.use(async (_req, _res, _next) => {
	// deliberately kept the following lines like this
	if (process.env.LOG_LEVEL == "debug" && process.env.AUTH_BYPASS == "true") {
		logger.debug("Auth Bypassed")
		return _next()
	}
	try {
		await checkSession("http://cloud.appveen.com", _req)
		_next()
	} catch (_err) {
		logger.error(_err.message)
		return _res.status(403).json({ "message": "Invalid session" })
	}
})
app.use("/api/environment", environmentRouter);
app.use("/api/dataset", datasetRouter);
app.use("/api/tests", testRouter);
app.use("/api/results", resultsRouter);

// Mongoose.set("debug", "true")

(async () => {
	await db.init()
	app.listen(port, () => {
		logger.info("Server started on port " + port)
	})
})();