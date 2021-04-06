const req = require('request-promise');
const db = require("../lib/db.client")
let logger = global.logger

const e = {}

const tokens = {}

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

async function login(_test) {
	return req({
		uri: _test.loginURL,
		method: 'POST',
		json: true,
		body: _test.user,
	});
};

async function check(_token, _test) {
	return req({
		uri: _test.checkURL,
		method: 'GET',
		json: true,
		headers: {
			'Authorization': `JWT ${_token}`
		}
	});
};

async function logout(_token, _test) {
	return req({
		uri: _test.logoutURL,
		method: 'DELETE',
		json: true,
		headers: {
			'Authorization': `JWT ${_token}`
		}
	});
};

async function makeAPICall(_test) {
	logger.debug(`Outbound call :: ${_test.method} ${_test.uri}`);
	const options = {
		uri: _test.uri,
		method: _test.method,
		json: true,
		resolveWithFullResponse: true,
		headers: {
			'Authorization': `JWT ${tokens[_test.method]}`
		}
	};
	if (_test.data) options['body'] = _test.data;
	return req(options);
};

async function runner(_testSuiteID, _resultSummaryID) {
	counter = 0;
	let cursor = await db.db.collection("tests").find({ testSuite: _testSuiteID })
		.batchSize(1)
	while (true) {
		let test = await cursor.next()
		if (test) {
			logger.info(`${_resultSummaryID} :: Running test ${test._id}`)
			try {
				// CHECK token and LOGIN if required.
				if (tokens[test.method]) {
					try {
						await check(tokens[test.method], test)
						logger.debug(`${_resultSummaryID} :: ${test._id} :: CHECK OK`)
					} catch (error) {
						logger.error(error.message)
						logger.error(`${_resultSummaryID} :: ${test._id} :: Invalid token. Attempting relogin`)
						let loginResonse = await login(test)
						tokens[test.method] = loginResonse.token
						logger.debug(`${_resultSummaryID} :: ${test._id} :: LOGIN :: Success`)
					}
				} else {
					logger.debug(`${_resultSummaryID} :: ${test._id} :: No active token`)
					let loginResonse = await login(test)
					tokens[test.method] = loginResonse.token
					logger.debug(`${_resultSummaryID} :: ${test._id} :: LOGIN :: Success`)
				}
				await makeAPICall(test)
					.then(_response => logger.info(_response.statusCode, test.responseCode, test.uri))
					.catch(_err => logger.info(_err.statusCode, test.responseCode, test.uri))
			} catch (e) {
				logger.error(`${_resultSummaryID} :: ${test._id} :: ${e.message}`)
				break;
			}
		} else break
	}
}

e.run = async (_testSuiteID, _resultSummaryID) => {
	_testSuiteID
	await __createResultSummary(_testSuiteID, _resultSummaryID)
	await runner(_testSuiteID, _resultSummaryID)
};

module.exports = e