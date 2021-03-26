"use strict"
const Mongoose = require("mongoose")

let definition = {
	"_id": "String",
	"testSuite": "String",
	"app": "String",
	"dataserviceName": "String",
	"api": "String",
	"dataSet": "String",
	"generatedOn": "Date",
}

module.exports = Mongoose.Schema(definition)