const faker = require('faker')
const stringASCII = require('./testData/string.ascii')
const stringData = require('./testData/string')

let e = {}

function __handleStringType(_testId, _definition) {
  console.log(_definition)
  stringASCII.forEach(_char => {
    let testJson = {}
    testJson[_definition.key] = _char
    // console.log(testJson)
  })
}

e.generateSampleData = (definition) => {
  let testId = faker.random.words(3).toLowerCase().split(" ").join("-")
  definition.forEach(_definition => {
    // console.log(_definition)
    if (_definition.key == "_id") return
    if (_definition.type === 'String' && _definition.key === "dsStringText1001") __handleStringType(testId, _definition);
    // if (_definition.type === 'Number') temp[_definition.key] = +faker.random.number();
    // if (_definition.type === 'Boolean') temp[_definition.key] = faker.random.boolean();
    // if (_definition.type === 'Date') temp[_definition.key] = faker.date.past().toISOString();
    // if (_definition.type === 'Object') temp[_definition.key] = generateSampleData(_definition.definition);
    // if (_definition.type === 'Array') temp[_definition.key] = [generateSampleData(_definition.definition)._self];
  })
}

module.exports = e;