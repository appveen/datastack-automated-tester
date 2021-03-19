const mongodb = require("mongodb")
const URL = process.env.MONGOURL ? process.env.MONGOURL : 'mongodb://localhost:27017'
const DB_NAME = process.env.DB_NAME ? process.env.DB_NAME : "dataStackTests"

const client = new mongodb.MongoClient(URL, {
	readPreference: mongodb.ReadPreference.SECONDARY_PREFERRED,
	useUnifiedTopology: true
})

let db = null

let e = {}

e.init = async () => {
	try {
		await client.connect()
		db = client.db(DB_NAME)
		console.log(`Connected to DB :: ${DB_NAME}`)
	} catch (_err) {
		console.log(_err.message)
	}
}

e.insert = async (_data) => await db.collection("dataServices").insertOne(_data)

e.update = async (_id, _data) => await db.collection("dataServices").updateOne({ '_id': _id }, { "$set": _data })


module.exports = e