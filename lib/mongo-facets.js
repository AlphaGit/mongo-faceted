var _ = require('lodash');

var MongoFacets = {};

MongoFacets.getFacets = function (collection, filter, facetTypes, cb) {
  var aggregationSteps = [];
  aggregationSteps.push({ $match: filter });

  var groupFields = { _id: null };

  _.forOwn(facetTypes, function (facetType, facetName) {
    if (facetType === Array) {
      aggregationSteps.push({ $unwind: '$' + facetName });
    }
    groupFields[facetName] = { $addToSet: '$' + facetName };
  });

  aggregationSteps.push({ $group: groupFields });

  collection.aggregate(aggregationSteps, function (err, aggregationResults) {
    aggregationResults = aggregationResults[0];
    delete aggregationResults._id;
    cb(err, aggregationResults);
  });
};

module.exports = MongoFacets;
