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
	"environment": "String",
	"app": "String",
	"dataserviceName": "String",
	"api": "String",
	"testEachAttribute": {
		"type": "Boolean",
		"default": "true"
	},
	"testParams": "Object"
}

module.exports = Mongoose.Schema(definition)