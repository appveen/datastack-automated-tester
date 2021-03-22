"use strict"
const Mongoose = require("mongoose")

let definition = {
	"name": {
		"type": "String",
		"unique": true,
		"required": true,
		"sparse": true
	},
	"url": "String",
	"username": "String",
	"password": "String",
	"app": "String",
	"dataServices": [{
		"_id": "String",
		"name": "String",
	}]
}

module.exports = Mongoose.Schema(definition)