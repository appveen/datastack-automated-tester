"use strict"
const Mongoose = require("mongoose")

let definition = {
	"testId": "String",
	"testSet": "String",
	"startDate": "Date",
	"encDate": "Date",
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