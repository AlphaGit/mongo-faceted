var MongoClient = require('mongodb').MongoClient;
var TestFw = require('../mongo-test-framework');
var async = require('async');
var should = require('should');

describe('Mongo Testing Framework', function() {
  var db = null;
  beforeEach(function(done) {
    TestFw.beforeEachHook(function(openedDb) {
      db = openedDb;
      done();
    });
  });
  afterEach(TestFw.afterEachHook);

  it('should drop all data present in the database', function(done) {
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
      function(insertedDoc, cb) {
        exampleCollection.count(cb);
      },
      function(count, cb) {
        count.should.equal(1); // we should find the saved resource
        cb();
      },
      function(cb) {
        TestFw.afterEachHook(cb);
      },
      function(closeResult, cb) {
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

  it('should not contain any collections to being with', function(done) {
    async.waterfall([
      function(cb) {
        db.collections(cb);
      },
      function(collections, cb) {
        collections.length.should.equal(0);
        cb();
      }
    ], done);
  });

  it('should be able to create and add documents into the db', function(done) {
    var exampleDoc = {
      stringField: "Some example text",
      numberField: 1,
      arrayOfStringsField: ["One", "Two", "Three"]
    };

    async.waterfall([
      function(cb) {
        db.createCollection('examples', cb);
      },
      function(exampleCollection, cb) {
        exampleCollection.insert(exampleDoc, cb);
      },
      function(insertedDoc, cb) {
        db.collection('examples', cb);
      },
      function(exampleCollection, cb) {
        exampleCollection.find().toArray(cb);
      },
      function(results, cb) {
        should.exist(results);
        results.length.should.equal(1);
        results[0].should.be.eql(exampleDoc);
        cb();
      }
    ], done);
  });
});