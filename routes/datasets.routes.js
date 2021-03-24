const MongooseExpressMiddleware = require("mongoose-express-middleware")
const express = require('express');
const router = express.Router();

let schema = require("../schema/dataset.schema")

const datasetCrud = new MongooseExpressMiddleware("dataset", schema, null)
const apiClient = require("../lib/api.client")
const dbClient = require("../lib/db.client")

const stringASCII = require("../testData/string.ascii")
const stringData = require("../testData/string");
const numberData = require("../testData/number");
const dateData = require("../testData/date");
const locationData = require("../testData/location");

router.post("", datasetCrud.create)
router.get("", datasetCrud.index)
router.get("/:id", datasetCrud.show)
router.put("/:id", datasetCrud.update)
router.delete("/:id", datasetCrud.destroy)

router.post("/init", async (_req, _res) => {
	try {
		await dbClient.deleteDocument("datasets", { "_id": "stringASCII" })
		await dbClient.deleteDocument("datasets", { "_id": "stringData" })
		await dbClient.deleteDocument("datasets", { "_id": "numberData" })
		await dbClient.deleteDocument("datasets", { "_id": "dateData" })
		await dbClient.deleteDocument("datasets", { "_id": "locationData" })
		await dbClient.insertDocument("datasets", { "_id": "stringASCII", data: stringASCII })
		await dbClient.insertDocument("datasets", { "_id": "stringData", data: stringData })
		await dbClient.insertDocument("datasets", { "_id": "numberData", data: numberData })
		await dbClient.insertDocument("datasets", { "_id": "dateData", data: dateData })
		await dbClient.insertDocument("datasets", { "_id": "locationData", data: locationData })
		_res.end()
	} catch (_err) {
		apiClient.handleError(_err, _res)
	}
})

module.exports = router