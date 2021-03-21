const MongooseExpressMiddleware = require("mongoose-express-middleware")
const express = require('express');
const router = express.Router();

let schema = require("../schema/dataset.schema")

const datasetCrud = new MongooseExpressMiddleware("dataset", schema, null)

router.post("", datasetCrud.create)
router.get("", datasetCrud.index)
router.get("/:id", datasetCrud.show)
router.put("/:id", datasetCrud.update)
router.delete("/:id", datasetCrud.destroy)

module.exports = router