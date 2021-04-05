const MongooseExpressMiddleware = require("mongoose-express-middleware")
const express = require('express');
const router = express.Router();

const db = require("../lib/db.client")

let schema = require("../schema/test.schema")

const testsCrud = new MongooseExpressMiddleware("tests", schema, null)

router.post("", testsCrud.create)
router.get("", testsCrud.index)
router.get("/bulkShow", testsCrud.bulkShow)
router.put("/bulkUpdate", testsCrud.bulkUpdate)
router.get("/:id", testsCrud.show)
router.put("/:id", testsCrud.update)
router.delete("/:id", testsCrud.destroy)

router.delete("/testSuite/:id", async (_req, _res) => {
	try {
		const filter = {
			testSuite: _req.params.id
		}
		logger.debug(filter);
		await db.deleteDocument("tests", filter)
		_res.end();
	} catch (_err) {
		apiClient.handleError(_err, _res);
	}
})

module.exports = router