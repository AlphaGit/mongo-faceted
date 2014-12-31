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
      arrayOfStringsField: ['Uno', 'Eins', 'Raz']
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

    it('should return the regular results when calling searchWithFacets', function(done) {
      ExampleModel.searchWithFacets({}, function(error, results) {
        should.not.exist(error);
        should.exist(results);
        results.length.should.equal(3);
        results[0].toObject().should.containEql(testData[0]);
        results[1].toObject().should.containEql(testData[1]);
        results[2].toObject().should.containEql(testData[2]);

        done();
      });
    });

    it('should also return facets for the search', function(done) {
      ExampleModel.searchWithFacets({}, function(error, results) {
        should.not.exist(error);
        should.exist(results);
        should.exist(results.facets);
        should.exist(results.facets.stringField);
        should.exist(results.facets.numberField);
        should.exist(results.facets.arrayOfStringsField);

        done();
      });
    });

    describe('String facets', function() {
      it('should return all values if no filter was passed', function(done) {
        ExampleModel.searchWithFacets({}, function(error, results) {
          should.exist(results.facets.stringField);
          results.facets.stringField.should.be.an.Array;

          var expectedStringFacets = _.sortBy(['One', 'Two', 'Three']);
          var actualStringFacets = _.sortBy(results.facets.stringField);

          actualStringFacets.should.eql(expectedStringFacets);

          done();
        });
      });

      it('should return a subset of values for a single result', function(done) {
        ExampleModel.searchWithFacets({ numberField: 1 }, function(error, results) {
          should.exist(results.facets.stringField);
          results.facets.stringField.should.be.an.Array;

          results.facets.stringField.should.eql(['One']);

          done();
        });
      });

      it('should return a subset of values for other filters', function(done) {
        var filter = { $or: [{ numberField: 1 }, { numberField: 2 }] };
        ExampleModel.searchWithFacets(filter, function(error, results) {
          should.exist(results.facets.stringField);
          results.facets.stringField.should.be.an.Array;

          var expectedStringFacets = _.sortBy(['One', 'Two']);
          var actualStringFacets = _.sortBy(results.facets.stringField);

          actualStringFacets.should.eql(expectedStringFacets);

          done();
        });
      });
    });

    describe('Number facets', function() {
      it('should return all values if no filter was passed', function(done) {
        ExampleModel.searchWithFacets({}, function(error, results) {
          should.exist(results.facets.numberField);
          results.facets.numberField.should.be.an.Array;

          var expectedNumberFacets = _.sortBy([1, 2, 3]);
          var actualNumberFacets = _.sortBy(results.facets.numberField);

          actualNumberFacets.should.eql(expectedNumberFacets);

          done();
        });
      });

      it('should return a subset of values for a single result', function(done) {
        ExampleModel.searchWithFacets({ stringField: 'One' }, function(error, results) {
          should.exist(results.facets.numberField);
          results.facets.numberField.should.be.an.Array;

          results.facets.numberField.should.eql([1]);

          done();
        });
      });

      it('should return a subset of values for other filters', function(done) {
        var filter = { $or: [{ stringField: 'One' }, { stringField: 'Two' }] };
        ExampleModel.searchWithFacets(filter, function(error, results) {
          should.exist(results.facets.numberField);
          results.facets.numberField.should.be.an.Array;

          var expectedNumberFacets = _.sortBy([1, 2]);
          var actualNumberFacets = _.sortBy(results.facets.numberField);

          actualNumberFacets.should.eql(expectedNumberFacets);

          done();
        });
      });
    });

    describe('Array facets', function() {
      it('should return all values joined if no filter was passed', function(done) {
        ExampleModel.searchWithFacets({}, function(error, results) {
          should.exist(results.facets.arrayOfStringsField);
          results.facets.arrayOfStringsField.should.be.an.Array;

          var expectedArrayOfStringsFacets = _.sortBy(['Uno', 'Dos', 'Tres', 'Eins', 'Zwei', 'Drei', 'Raz', 'Dva', 'Tri']);
          var actualArrayOfStringsFacets = _.sortBy(results.facets.arrayOfStringsField);

          actualArrayOfStringsFacets.should.eql(expectedArrayOfStringsFacets);

          done();
        });
      });

      it('should return a subset of values for a single result', function(done) {
        ExampleModel.searchWithFacets({ numberField: 1 }, function(error, results) {
          should.exist(results.facets.arrayOfStringsField);
          results.facets.arrayOfStringsField.should.be.an.Array;

          var expectedArrayOfStringsFacets = _.sortBy(['Uno', 'Eins', 'Raz']);
          var actualArrayOfStringsFacets = _.sortBy(results.facets.arrayOfStringsField);

          actualArrayOfStringsFacets.should.eql(expectedArrayOfStringsFacets);

          done();
        });
      });

      it('should return a subset of values for other filters', function(done) {
        var filter = { $or: [{ numberField: 1 }, { numberField: 2 }] };
        ExampleModel.searchWithFacets(filter, function(error, results) {
          should.exist(results.facets.arrayOfStringsField);
          results.facets.arrayOfStringsField.should.be.an.Array;

          var expectedArrayOfStringsFacets = _.sortBy(['Uno', 'Dos', 'Eins', 'Zwei', 'Raz', 'Dva']);
          var actualArrayOfStringsFacets = _.sortBy(results.facets.arrayOfStringsField);

          actualArrayOfStringsFacets.should.eql(expectedArrayOfStringsFacets);

          done();
        });
      });
    });
  });
});
