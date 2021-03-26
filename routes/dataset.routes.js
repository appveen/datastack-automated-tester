const MongooseExpressMiddleware = require("mongoose-express-middleware")
const express = require('express');
const router = express.Router();

let schema = require("../schema/dataset.schema")

const datasetCrud = new MongooseExpressMiddleware("dataset", schema, null)
const apiClient = require("../lib/api.client")
const dbClient = require("../lib/db.client")

const stringData = require("../testData/string");
const numberData = require("../testData/number");
const booleanData = require("../testData/boolean");
const dateData = require("../testData/date");
const locationData = require("../testData/location");

router.post("", datasetCrud.create)
router.get("", datasetCrud.index)
router.get("/:id", datasetCrud.show)
router.put("/:id", datasetCrud.update)
router.delete("/:id", datasetCrud.destroy)

router.post("/init", async (_req, _res) => {
	try {
		await dbClient.deleteDocument("datasets", {})
		await dbClient.insertDocument("datasets", { "_id": "String", data: stringData })
		await dbClient.insertDocument("datasets", { "_id": "Number", data: numberData })
		await dbClient.insertDocument("datasets", { "_id": "Date", data: dateData })
		await dbClient.insertDocument("datasets", { "_id": "Boolean", data: booleanData })
		await dbClient.insertDocument("datasets", { "_id": "Location", data: locationData })
		_res.end()
	} catch (_err) {
		apiClient.handleError(_err, _res)
	}
})

module.exports = router