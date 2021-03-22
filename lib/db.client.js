const Mongoose = require("mongoose")
const mongodb = require("mongodb")
const config = require("../config")

const client = new mongodb.MongoClient(config.db.MONGOURL, config.db.clinetOptions)

let logger = global.logger

logger.info(`MONGOURL : ${config.db.MONGOURL}`)

let db = null

let e = {}

e.init = async () => {
	try {
		await Mongoose.connect(config.db.MONGOURL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			dbName: config.db.DB_NAME
		})
		await client.connect()
		db = client.db(config.db.DB_NAME)
		logger.info(`Connected to DB :: ${config.db.DB_NAME}`)
	} catch (_err) {
		logger.error(_err)
	}
}

e.insertDocument = async (_collection, _data) => {
	logger.trace(`insertDocument :: ${_collection} :: ${JSON.stringify(_data)}`)
	await db.collection(_collection).insertOne(_data)
}

e.insertDocuments = async (_collection, _data) => {
	logger.trace(`insertDocuments :: ${_collection} :: ${JSON.stringify(_data)}`)
	await db.collection(_collection).insertMany(_data)
}

e.updateDocument = async (_collection, _id, _data) => {
	logger.debug(`updateDocument :: ${_collection} :: ${_id}`)
	logger.trace(`updateDocument :: ${_collection} :: ${JSON.stringify(_data)}`)
	await db.collection(_collection).updateOne({ '_id': _id }, { "$set": _data })
}

e.deleteDocument = async (_collection, _filter) => {
	logger.debug(`deleteDocument :: ${_collection} :: ${JSON.stringify(_filter)}`)
	await db.collection(_collection).deleteMany(_filter)
}



module.exports = e