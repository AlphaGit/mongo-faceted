var MongoClient = require('mongodb').MongoClient;
var TestFw = require('../mongo-test-framework');
var async = require('async');

describe('Mongo Testing Framework', function() {
  var db = null;
  beforeEach(function(done) {
    TestFw.beforeEachHook(function(openedDb) {
      db = openedDb;
      done();
    });
  });
  afterEach(TestFw.afterEachHook);

  // TODO fix -- test failing
  it.skip('should drop all data present in the database', function(done) {
    var exampleDoc = {
      stringField: "Some example text",
      numberField: 1,
      arrayOfStringsField: ["One", "Two", "Three"]
    };

    var exampleCollection = null;
    async.waterfall([
      function(cb) {
        db.createCollection('examples', cb);
      },
      function(createdCollection, cb) {
        exampleCollection = createdCollection;
        exampleCollection.insert(exampleDoc, cb);
      },
      function(cb) {
        debugger;
        exampleCollection.count(cb);
      },
      function(count, cb) {
        count.should.equal(1); // we should find the saved resource
        cb();
      },
      function(cb) {
        TestFw.afterEachHook(cb);
      },
      function(cb) {
        TestFw.beforeEachHook(function(openedDb) {
          db = openedDb;
          cb();
        });
      },
      function(cb) {
        exampleCollection = db.collection('examples');
        exampleCollection.count({}, cb);
      },
      function(count, cb) {
        count.should.equal(0); // we should not have data anymore
        cb();
      }
    ], done);
  });
});