var mongoose = require('mongoose');
var SchemaTypes = mongoose.SchemaTypes;
var _ = require('lodash');
var MongoFacets = require('./mongo-facets');

function MongooseFacets(ModelName, Schema) {
  function getFacetTypes(paths) {
    return _.mapValues(paths, function (type) {
      // We could map all other SchemaTypes but we don't use them at all
      // See mongo-facets#getFacets
      // Old reference: f357900efa9d2b40278777a50985815f75b9ae5e
      if (type instanceof SchemaTypes.Array) return Array;
      return Object;
    });
  }

  function getFacets(filter, cb) {
    var model = mongoose.model(ModelName);
    var facetTypes = getFacetTypes(Schema.paths);
    delete facetTypes._id;
    delete facetTypes.__v;

    MongoFacets.getFacets(model, filter, facetTypes, cb);
  }

  function findWithFacets(filters, cb) {
    this.find(filters, function (err, results) {
      if (err) { return cb(err, results); }
      getFacets(filters, function (err, facets) {
        results.facets = facets;
        cb(err, results);
      });
    });
  }

  Schema.statics.findWithFacets = findWithFacets;
  Schema.statics.getFacets = getFacets;

  return Schema;
}

module.exports = MongooseFacets;
