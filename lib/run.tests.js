const db = require("../lib/db.client")
let logger = global.logger

const e = {}

async function __createResultSummary(_testSuiteID, _resultSummaryID) {
	let testSuite = await db.findOne("testsuites", { _id: _testSuiteID });
	let numberOfTests = await db.count("tests", { testSuite: _testSuiteID });
	const data = {
		"_id": _resultSummaryID,
		"testSuite": testSuite._id,
		"startDate": new Date(),
		"tests": numberOfTests,
		"pass": 0,
		"fail": 0,
		"endpoint": testSuite.api,
		"status": "Pending"
	}
	await db.insertDocument("resultsummaries", data);
}

e.run = async (_testSuiteID, _resultSummaryID) => {_testSuiteID
	await __createResultSummary(_testSuiteID, _resultSummaryID)
};

module.exports = e