const MongooseExpressMiddleware = require("mongoose-express-middleware")
const express = require('express');
const router = express.Router();

let schema = require("../schema/tests.schema")

const testsCrud = new MongooseExpressMiddleware("tests", schema, null)

router.post("", testsCrud.create)
router.get("", testsCrud.index)
router.get("/bulkShow", testsCrud.bulkShow)
router.put("/bulkUpdate", testsCrud.bulkUpdate)
router.delete("/bulkDelete", testsCrud.bulkDestroy)
router.get("/:id", testsCrud.show)
router.put("/:id", testsCrud.update)
router.delete("/:id", testsCrud.destroy)

module.exports = router