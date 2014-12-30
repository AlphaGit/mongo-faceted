var ExampleModel = require('../example-model');
var mongoose = require('mongoose');
var TestFw = require('../test-framework');
var async = require('async');

describe('Testing framework', function() {
  beforeEach(TestFw.beforeEachHook);
  afterEach(TestFw.afterEachHook);

  it('should connect correctly to the database', function(done) {
    mongoose.connection.readyState.should.equal(1);
    done();
  });

  it('should not contain any elements to begin with', function(done) {
    async.waterfall([
      function(cb) {
        ExampleModel.find({}, cb);
      },
      function(results, cb) {
        results.length.should.equal(0);
        cb();
      }
    ], done);
  });

  it('should be able to create and add documents into the db', function(done) {
    var newExampleModel = new ExampleModel({
      stringField: "Some example text",
      numberField: 1,
      arrayOfStringsField: ["One", "Two", "Three"]
    });

    async.waterfall([
      function(cb) {
        newExampleModel.save(cb);
      },
      function(savedDoc, numAffected, cb) {
        ExampleModel.find({}, cb);
      },
      function(results, cb) {
        results.length.should.equal(1);

        var original = newExampleModel.toObject();
        var saved = results[0].toObject();

        saved.should.be.eql(original);
        cb();
      }
    ], done);
  });
});
