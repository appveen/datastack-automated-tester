const db = require("./db.client")

let logger = global.logger

let e = {}

async function __generateTestPayload(_testDataStructure, _data, _updateData) {
  let testData = JSON.parse(JSON.stringify(_testDataStructure))
  // POST
  testData.method = "POST"
  testData.data = _data
  testData.responseCode = 200
  testData['_id'] = `${_data._id}-1-POST`
  await db.insertDocument('tests', testData)
  testData.api = `${testData.api}/${testData.data._id}`
  // GET
  testData.method = "GET"
  testData['_id'] = `${_data._id}-2-GET-200`
  await db.insertDocument('tests', testData)
  // PUT
  testData.method = "PUT"
  testData.data = _updateData
  testData['_id'] = `${_data._id}-3-PUT`
  await db.insertDocument('tests', testData)
  // GET
  testData.method = "GET"
  testData['_id'] = `${_data._id}-4-GET-200`
  await db.insertDocument('tests', testData)
  // DELETE
  testData.method = "DELETE"
  testData['_id'] = `${_data._id}-5-DELETE`
  await db.insertDocument('tests', testData)
  // GET
  testData.method = "GET"
  testData.responseCode = 400
  testData['_id'] = `${_data._id}-6-GET-400`
  await db.insertDocument('tests', testData)
}

async function __generateTestsBasedOnMapping(_testDataStructure, _attribute, _dataset) {
  const dataset = await db.findOne('datasets', { _id: _dataset })
  await dataset.data.reduce(async (prev, _data) => {
    await prev;
    let data = {
      _id: `${_attribute}-${_dataset}-${Math.ceil(Math.random() * 1000000)}`,
    }
    data[_attribute] = _data;
    let updateData = {}
    updateData[_attribute] = `${_data}${_data}${_data}`
    return await __generateTestPayload(_testDataStructure, data, updateData)
  }, Promise.resolve())
}

e.generate = async (_testSuite) => {
  let testSet = `${_testSuite._id}-${_testSuite.environment}-${_testSuite.app}-${_testSuite.dataservice}`;
  logger.info(`TestID :: ${testSet}`)
  let testDataStructure = {
    testSet: testSet,
    app: _testSuite.app,
    name: _testSuite.dataserviceName,
    method: "POST",
    responseCode: 200,
    api: `/api/c/${_testSuite.app}${_testSuite.api}`,
    json: true,
    data: {},
  }
  await _testSuite.testParams.reduce(async (_p, _testParam) => {
    await _p;
    logger.info(`[${testSet}] :: ${_testParam.join(" - ")}`)
    if (_testSuite.testEachAttribute) {
      await __generateTestsBasedOnMapping(testDataStructure, _testParam[0], _testParam[1])
    }
  }, Promise.resolve())
}

module.exports = e;