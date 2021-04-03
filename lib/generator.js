const db = require("./db.client")

let logger = global.logger

let e = {}

async function __generatePayload(_testDataStructure, _data, _updateData) {
  let testData = JSON.parse(JSON.stringify(_testDataStructure))
  // POST
  testData.method = "POST"
  testData.data = _data
  testData.responseCode = 200
  await db.insertDataservice(testData)
  testData.api = `${testData.api}/${testData.data._id}`
  // GET
  testData.method = "GET"
  await db.insertDataservice(testData)
  // PUT
  testData.method = "PUT"
  testData.data = _updateData
  await db.insertDataservice(testData)
  // GET
  testData.method = "GET"
  await db.insertDataservice(testData)
  // DELETE
  testData.method = "DELETE"
  await db.insertDataservice(testData)
  // GET
  testData.method = "GET"
  testData.responseCode = 400
  await db.insertDataservice(testData)
}

async function __handleStringType(_testDataStructure, _definition) {
  logger.debug(`[${_testDataStructure.testSet}] [${_definition.key}] Generating string-ascii data`)
  let counter = 0

  await stringASCII.reduce(async (_prev, _char) => {
    await _prev
    counter++
    let data = {
      _id: `${_definition.key}-${counter}`
    }
    data[_definition.key] = _char
    let updateData = {}
    updateData[_definition.key] = `${_char}${_char}${_char}`
    return await __generatePayload(_testDataStructure, data, updateData)
  }, Promise.resolve())
  logger.debug(`[${_testDataStructure.testSet}] [${_definition.key}] Finished generating string-ascii data`)

  logger.debug(`[${_testDataStructure.testSet}] [${_definition.key}] Generating string data`)
  await stringData.reduce(async (_prev, _string) => {
    await _prev
    counter++
    let data = {
      _id: `${_definition.key}-${counter}`
    }
    data[_definition.key] = _string
    let updateData = {}
    updateData[_definition.key] = `${_string}${_string}${_string}`
    return await __generatePayload(_testDataStructure, data, updateData)
  }, Promise.resolve())
  logger.debug(`[${_testDataStructure.testSet}] [${_definition.key}] Finished generating string data`)
}

async function __generateTestsBasedOnMapping(_testDataStructure, _attribute, _dataset) {
  const dataset = await db.findOne('datasets', { _id: _dataset })
  console.log(_attribute, dataset.data.length)
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