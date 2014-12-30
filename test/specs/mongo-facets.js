var async = require('async');
var should = require('should');
var mongoose = require('mongoose');
var mongoFacets = require('../../lib/mongo-facets');

function initDbConnection(cb) {
  mongoose.connect('mongodb://localhost:27017/faceted', function() {
    cb();
  });
}

/******************************* EXAMPLE MODEL *******************************/
var ExampleSchema = new mongoose.Schema({
  stringField: String,
  numberField: Number,
  arrayOfStringsField: [String]
});

var ExampleModel = mongoose.model('Example', ExampleSchema);

mongoFacets(ExampleSchema, ExampleModel);

/*********************************** TESTS ***********************************/
describe('Testing framework', function() {
  beforeEach(function(done) {
    async.waterfall([
      initDbConnection,
      function(cb) {
        mongoose.connection.db.dropDatabase(cb);
      }
    ], function(err) {
      if (err) console.error(err);
      done();
    });
  });

  afterEach(function(done) {
    mongoose.disconnect(function() {
      done();
    });
  });

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
