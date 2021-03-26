"use strict"
const Mongoose = require("mongoose")

let definition = {
	"_id": "String",
	"name": {
		"type": "String",
		"unique": true,
		"required": true,
		"sparse": true
	},
	"testSuite": "String",
	"app": "String",
	"dataserviceName": "String",
	"api": "String",
	"dataSet": "String",
	"generatedOn": "Date",
}

module.exports = Mongoose.Schema(definition)