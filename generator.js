const faker = require('faker')
const db = require("./db.client")
const stringASCII = require('./testData/string.ascii')
const stringData = require('./testData/string')

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
  logger.debug(`[${_testDataStructure.testId}] [${_definition.key}] Generating string-ascii data`)
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
  logger.debug(`[${_testDataStructure.testId}] [${_definition.key}] Finished generating string-ascii data`)

  logger.debug(`[${_testDataStructure.testId}] [${_definition.key}] Generating string data`)
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
  logger.debug(`[${_testDataStructure.testId}] [${_definition.key}] Finished generating string data`)
}

e.generateSampleData = async (_dataServices) => {
  let testId = faker.random.words(3).toLowerCase().split(" ").join("-")
  logger.info(`TestID :: ${testId}`)
  let testDataStructure = {
    testId: testId,
    app: _dataServices.app,
    name: _dataServices.name,
    method: "POST",
    responseCode: 200,
    api: `/api/c/${_dataServices.app}${_dataServices.api}`,
    json: true,
    data: {},
  }
  await _dataServices.definition.reduce(async (_prev, _definition) => {
    await _prev
    // console.log(_definition)
    if (_definition.key == "_id") return
    if (_definition.type === 'String') await __handleStringType(testDataStructure, _definition);
    // if (_definition.type === 'Number') temp[_definition.key] = +faker.random.number();
    // if (_definition.type === 'Boolean') temp[_definition.key] = faker.random.boolean();
    // if (_definition.type === 'Date') temp[_definition.key] = faker.date.past().toISOString();
    // if (_definition.type === 'Object') temp[_definition.key] = generateSampleData(_definition.definition);
    // if (_definition.type === 'Array') temp[_definition.key] = [generateSampleData(_definition.definition)._self];
  }, Promise.resolve())
}

module.exports = e;