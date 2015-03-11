var mongoose = require('mongoose');
var SchemaTypes = mongoose.SchemaTypes;
var _ = require('lodash');

function MongooseFacets(ModelName, Schema) {
  function getFacets(searchParameters, searchResults, cb) {
    var aggregationSteps = [];
    aggregationSteps.push({ $match: searchParameters });

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
        if (err) { return cb(err, searchResults); }
        searchResults.facets = aggregationResults[0];
        cb(null, searchResults);
      });
  }

  function searchWithFacets(filters, cb) {
    cb = cb || function () {};

    this.find(filters, function (err, results) {
      if (err) { return cb(err, results); }
      getFacets(filters, results, cb);
    });
  }

  Schema.statics.searchWithFacets = searchWithFacets;

  return Schema;
}

module.exports = MongooseFacets;
