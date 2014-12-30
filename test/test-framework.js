var async = require('async');
var should = require('should');
var mongoose = require('mongoose');

var TestFw = {};

function initDbConnection(cb) {
  mongoose.connect('mongodb://localhost:27017/faceted', function() {
    cb();
  });
}

/********************************* HELPERS ***********************************/
TestFw.beforeEachHook = function beforeEachHook(done) {
  async.waterfall([
    initDbConnection,
    function(cb) {
      mongoose.connection.db.dropDatabase(cb);
    }
  ], function(err) {
    if (err) console.error(err);
    done();
  });
};

TestFw.afterEachHook = function afterEachHook(done) {
  mongoose.disconnect(done);
};

module.exports = TestFw;
