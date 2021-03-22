"use strict"
const Mongoose = require("mongoose")

let definition = {
	"name": {
		"type": "String",
		"unique": true,
		"required": true,
		"sparse": true
	},
	"dataServices": "Object"
}

module.exports = Mongoose.Schema(definition)