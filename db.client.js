const mongodb = require("mongodb")
const MONGOURL = process.env.MONGOURL ? process.env.MONGOURL : 'mongodb://localhost:27017'
const DB_NAME = process.env.DB_NAME ? process.env.DB_NAME : "dataStackTests"

const client = new mongodb.MongoClient(MONGOURL, {
	readPreference: mongodb.ReadPreference.SECONDARY_PREFERRED,
	useUnifiedTopology: true
})

let logger = global.logger

logger.info(`MONGOURL : ${MONGOURL}`)

let db = null

let e = {}

e.init = async () => {
	try {
		await client.connect()
		db = client.db(DB_NAME)
		logger.info(`Connected to DB :: ${DB_NAME}`)
	} catch (_err) {
		logger.error(_err)
	}
}

e.insertDataservice = async (_data) => {
	logger.trace(`insertDataservice :: ${JSON.stringify(_data)}`)
	await db.collection("dataServices").insertOne(_data, { forceServerObjectId: true })
}

e.updateDataservice = async (_id, _data) => {
	logger.debug(`updateDataservice :: ${_id}`)
	logger.trace(`updateDataservice :: ${JSON.stringify(_data)}`)
	await db.collection("dataServices").updateOne({ '_id': _id }, { "$set": _data })
}

e.clearDataservice = async (_filter) => {
	logger.debug(`clearDataservice :: ${JSON.stringify(_filter)}`)
	await db.collection("dataServices").deleteMany(_filter)
}



module.exports = e