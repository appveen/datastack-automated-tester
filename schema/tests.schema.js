"use strict"
const Mongoose = require("mongoose")

let definition = {
	"testSet": "String",
	"app": "String",
	"name": "String",
	"method": {
		"type": "String",
		"enum": ["POST", "GET", "PUT", "DELETE", "PATCH", "OPTIONS"]
	},
	"responseCode": {
		"type": "Number",
		"enum": [200, 202, 400, 403, 400, 500]
	},
	"api": "String",
	"json": {
		"type": "Boolean",
		default: true
	},
	"data": "Object"
}

module.exports = Mongoose.Schema(definition)