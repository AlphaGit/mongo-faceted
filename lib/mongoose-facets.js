var mongoose = require('mongoose');
var SchemaTypes = mongoose.SchemaTypes;
var _ = require('lodash');

function MongooseFacets(ModelName, Schema) {
  function getFacets(filter, cb) {
    var aggregationSteps = [];
    aggregationSteps.push({ $match: filter });

    var groupFields = { _id: null };

    _.forOwn(Schema.paths, function (schemaType, schemaPathName) {
      if (schemaType instanceof SchemaTypes.Array) {
        aggregationSteps.push({ $unwind: '$' + schemaPathName });
      }
      if (schemaPathName == '_id') return;
      groupFields[schemaPathName] = { $addToSet: '$' + schemaPathName };
    });

    aggregationSteps.push({ $group: groupFields });

    mongoose
      .model(ModelName)
      .aggregate(aggregationSteps, function (err, aggregationResults) {
        aggregationResults = aggregationResults[0];
        delete aggregationResults._id;
        cb(err, aggregationResults);
      });
  }

  function searchWithFacets(filters, cb) {
    this.find(filters, function (err, results) {
      if (err) { return cb(err, results); }
      getFacets(filters, function (err, facets) {
        results.facets = facets;
        cb(err, results);
      });
    });
  }

  Schema.statics.searchWithFacets = searchWithFacets;
  Schema.statics.getFacets = getFacets;

  return Schema;
}

module.exports = MongooseFacets;
