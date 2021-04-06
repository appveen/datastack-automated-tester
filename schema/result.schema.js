"use strict"
const Mongoose = require("mongoose")

let definition = {
	"_id": "String",
	"resultSummary": "String",
	"testSuite": "String",
	"startDate": "Date",
	"endDate": "Date",
	"status": {
		"type": "String",
		"enum": ["PASS", "FAIl", "DNR"]
	},
	"endpoint": "String",
	"request": "Object",
	"responseHeaders": "Object",
	"response": "Object"
}

module.exports = Mongoose.Schema(definition)