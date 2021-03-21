"use strict"
const Mongoose = require("mongoose")

let definition = {
	"name": {
		"type": "String",
		"unique": true,
		"required": true
	},
	"url": "String",
	"username": "String",
	"password": "String",
	"dataServices": [{
		"app": "String",
		"dataServiceId": "String",
		"dataServiceName": "String",
	}]
}

module.exports = Mongoose.Schema(definition)