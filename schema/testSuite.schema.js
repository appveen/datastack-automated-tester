"use strict"
const Mongoose = require("mongoose")

let definition = {
	"_id": "String",
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