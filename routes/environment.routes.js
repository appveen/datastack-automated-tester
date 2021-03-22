const MongooseExpressMiddleware = require("mongoose-express-middleware")
const express = require('express');
const router = express.Router();

let schema = require("../schema/environment.schema")

const envCrud = new MongooseExpressMiddleware("environments", schema, null)

router.post("", envCrud.create)
router.get("", envCrud.index)
router.get("/:id", envCrud.show)
router.put("/:id", envCrud.update)
router.delete("/:id", envCrud.destroy)

router.post("/fetchApps", (_req, _res) => { })

module.exports = router