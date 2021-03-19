
const db = require('./db.client');
const generator = require('./generator');

let data = require('./data.json');

(async () => {
	await db.init()
	generator.generateSampleData(data.definition)
})();