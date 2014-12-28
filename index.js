var async = require('async');
var databaseConnection = require('./databaseConnection');
databaseConnection.initDbConnection(function(mongoose) {
  var ImageModel = require('./ImageModel')(mongoose);

  ImageModel.count({}, function(error, count) {
    console.log('Total results:', count);
  });

  var showResults = function(filter, showResults, cb) {
    ImageModel.searchWithFacets(filter, function(err, results) {
      if (err) return cb(err);

      console.log('Searching by', filter, results.length, 'results.');
      if (showResults) { console.log(results); }

      console.log('----------------------------------------------------');

      cb(null);
    });
  }

  async.waterfall([
      function (cb) {
        showResults({ height: 100 }, true, cb);
      },
      function (cb) {
        showResults({ width: 1920 }, true, cb);
      },
      function (cb) {
        showResults({ tags: ['person'] }, true, cb);
      }
    ], function(err) {
      if (err) console.error('Error searching: ', err);
      process.exit(0);
    });
}); // initDbConnection()