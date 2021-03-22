const MongooseExpressMiddleware = require("mongoose-express-middleware")
const express = require('express');
const router = express.Router();

let schema = require("../schema/dataset.schema")

const datasetCrud = new MongooseExpressMiddleware("dataset", schema, null)
const apiClient = require("../lib/api.client")
const dbClient = require("../lib/db.client")

const stringASCII = require("../testData/string.ascii")
const stringData = require("../testData/string");

router.post("", datasetCrud.create)
router.get("", datasetCrud.index)
router.get("/:id", datasetCrud.show)
router.put("/:id", datasetCrud.update)
router.delete("/:id", datasetCrud.destroy)

router.post("/init", async (_req, _res) => {
	try {
		await dbClient.deleteDocument("datasets", { "_id": "stringASCII" })
		await dbClient.deleteDocument("datasets", { "_id": "stringData" })
		await dbClient.insertDocument("datasets", { "_id": "stringASCII", data: stringASCII })
		await dbClient.insertDocument("datasets", { "_id": "stringData", data: stringData })
		_res.end()
	} catch (_err) {
		apiClient.handleError(_err, _res)
	}
})

module.exports = router