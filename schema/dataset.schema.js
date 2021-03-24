"use strict"
const Mongoose = require("mongoose")

let definition = {
	"_id": "String",
	"data": "Object",
	"dataService": {
		"type": "String",
		default: null
	},
}

module.exports = Mongoose.Schema(definition)