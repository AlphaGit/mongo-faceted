var async = require('async');
var mongoFacets = require('../../lib/mongo-facets');
var TestFw = require('../mongo-test-framework');
var should = require('should');

describe('mongo-facets', function() {
  var db = null;
  var exampleCollection = null;
  beforeEach(function(done) {
    TestFw.beforeEachHook(function(openedDb) {
      db = openedDb;
      done();
    });
  });
  afterEach(TestFw.afterEachHook);

  describe('#getFacets', function() {
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
      async.waterfall([
        function(cb) {
          db.createCollection('examples', cb);
        },
        function(createdCollection, cb) {
          exampleCollection = createdCollection;
          exampleCollection.insert(testData, cb);
        }
      ], done);
    });

    it('should retrieve facets', function(done) {
      var facetTypes = {
        arrayOfStringsField: Array,
        stringField: String,
        numberField: Number
      };

      async.waterfall([
        function(cb) {
          mongoFacets.getFacets(exampleCollection, {}, facetTypes, cb);
        },
        function(facets, cb) {
          should.exist(facets);
          should.exist(facets.stringField);
          should.exist(facets.numberField);
          should.exist(facets.arrayOfStringsField);
          cb();
        }
      ], done);
    });
  }); // describe #getFacets
});