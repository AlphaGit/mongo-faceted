var async = require('async');
var TestFw = require('../test-framework');
var mongoose = require('mongoose');
var ExampleModel = require('../example-model');
var should = require('should');
var _ = require('lodash');

describe('mongo-facets', function() {
  beforeEach(TestFw.beforeEachHook);
  afterEach(TestFw.afterEachHook);

  it('should define a searchWithFacets function in the model', function() {
    should.exist(ExampleModel.searchWithFacets);
  });

  describe('searchWithFacets', function() {
    var testData = [{
      stringField: 'One',
      numberField: 1,
      arrayOfStringsField: ['Uno', 'Eins', 'Ras']
    }, {
      stringField: 'Two',
      numberField: 2,
      arrayOfStringsField: ['Dos', 'Zwei', 'Dva']
    }, {
      stringField: 'Three',
      numberField: 3,
      arrayOfStringsField: ['Tres', 'Drei', 'Tri']
    }];

    beforeEach(function(done) {
      async.eachSeries(testData, function(testDatum, cb) {
        var model = new ExampleModel(testDatum);
        model.save(cb);
      }, done);
    });

    it('should not interfere with the regular find()', function(done) {
      ExampleModel.find({}, function(error, results) {
        should.not.exist(error);
        should.exist(results);
        results.length.should.equal(3);
        results[0].toObject().should.containEql(testData[0]);
        results[1].toObject().should.containEql(testData[1]);
        results[2].toObject().should.containEql(testData[2]);

        done();
      });
    });
  });
});
