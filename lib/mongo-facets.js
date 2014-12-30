var SchemaTypes = require('mongoose').SchemaTypes;
var _ = require('lodash');

function getTypeName(type) {
  if (type instanceof SchemaTypes.Array) { return 'Array'; }
  if (type instanceof SchemaTypes.Bool) { return 'Boolean'; }
  if (type instanceof SchemaTypes.Boolean) { return 'Boolean'; }
  if (type instanceof SchemaTypes.Buffer) { return 'Buffer'; }
  if (type instanceof SchemaTypes.Date) { return 'Date'; }
  if (type instanceof SchemaTypes.DocumentArray) { return 'DocumentArray'; }
  if (type instanceof SchemaTypes.Mixed) { return 'Mixed'; }
  if (type instanceof SchemaTypes.Number) { return 'Number'; }
  if (type instanceof SchemaTypes.Object) { return 'Object'; }
  if (type instanceof SchemaTypes.ObjectId) { return 'ObjectId'; }
  if (type instanceof SchemaTypes.Oid) { return 'ObjectId'; }
  if (type instanceof SchemaTypes.String) { return 'String'; }
}

function MongoFacets(Schema, Model) {
  var schemaPathTypeNames = _.mapValues(Schema.paths, function (type) {
    return getTypeName(type);
  });

  function getFacets(searchParameters, searchResults, cb) {
    var aggregationSteps = [];
    aggregationSteps.push({ $match: searchParameters });

    _.forOwn(schemaPathTypeNames, function (schemaTypeName, schemaPathName) {
      if (schemaTypeName === 'Array') {
        aggregationSteps.push({ $unwind: '$' + schemaPathName });
      }
    });

    var groupFields = { _id: null };

    _.forOwn(schemaPathTypeNames, function (schemaTypeName, schemaPathName) {
      groupFields[schemaTypeName] = { $addToSet: '$' + schemaPathName };
    });

    aggregationSteps.push({ $group: groupFields });

    Model.aggregate(aggregationSteps, function (err, aggregationResults) {
      if (err) { return cb(err, searchResults); }
      searchResults.facets = aggregationResults[0];
      cb(null, searchResults);
    });
  }

  function searchWithFacets(filters, cb) {
    cb = cb || function () {};

    Model.find(filters, function (err, results) {
      if (error) { return cb(error, results); }
      getFacets(searchParameters, results, cb);
    });
  }

  Schema.statics.searchWithFacets = searchWithFacets;

  return Schema;
}

module.exports = MongoFacets;