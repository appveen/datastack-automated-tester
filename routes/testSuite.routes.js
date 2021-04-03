const MongooseExpressMiddleware = require("mongoose-express-middleware")
const express = require('express');
const router = express.Router();

const apiClient = require('../lib/api.client')
const generator = require('../lib/generator')

let schema = require("../schema/testSuite.schema")

const testsCrud = new MongooseExpressMiddleware("testSuite", schema, null)

let logger = global.logger;

router.get("", testsCrud.index)
router.get("/bulkShow", testsCrud.bulkShow)
router.put("/bulkUpdate", testsCrud.bulkUpdate)
router.delete("/bulkDelete", testsCrud.bulkDestroy)
router.get("/:id", testsCrud.show)
router.put("/:id", testsCrud.update)
router.delete("/:id", testsCrud.destroy)

router.post("", async (_req, _res) => {
	try {
		const data = _req.body;
		logger.trace(data);
		let response = await testsCrud.model(data).save();
		await generator.generate(response);
		_res.json(response);
	} catch (_err) {
		apiClient.handleError(_err, _res);
	}
})

module.exports = router