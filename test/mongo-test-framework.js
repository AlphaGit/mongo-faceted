var async = require('async');
var mongo = require('mongodb').MongoClient;

var TestFw = {};

function initDbConnection(cb) {
  mongo.connect('mongodb://localhost:27017/faceted', cb);
}

/********************************* HELPERS ***********************************/
TestFw.beforeEachHook = function beforeEachHook(done) {
  async.waterfall([
    initDbConnection,
    function(db, cb) {
      TestFw._db = db;
      db.dropDatabase(cb);
    },
  ], function(err) {
    if (err) console.error(err);
    done(TestFw._db);
  });
};

TestFw.afterEachHook = function afterEachHook(done) {
  var db = TestFw._db;
  delete TestFw._db;
  db.close(done);
};

module.exports = TestFw;