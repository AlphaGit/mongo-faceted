var mongoose = require('mongoose');
var mongooseFacets = require('../lib/mongoose-facets');

var ExampleModel;

try {
  ExampleModel = mongoose.model('Example');
} catch (e) {
  if (e.name !== 'MissingSchemaError') throw e;

  var ExampleSchema = new mongoose.Schema({
    stringField: String,
    numberField: Number,
    arrayOfStringsField: [String]
  });

  mongooseFacets('Example', ExampleSchema);

  ExampleModel = mongoose.model('Example', ExampleSchema);
}

module.exports = ExampleModel;
