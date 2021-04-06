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
		"enum": ["PASS", "FAIl", "PENDING"],
		"default": "PENDING"
	},
	"comment": "String",
	"uri": "String",
	"method": "String",
	"data": "Object",
	"expectedStatus": "Number",
	"responseHeaders": "Object",
	"response": "Object",
	"responseStatus": "Number"
}

module.exports = Mongoose.Schema(definition)