var async = require('async');
var mongoFacets = require('../../lib/mongo-facets');

describe('mongo-facets', function() {
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

  beforeEach(function() {
    // insert test values in the database
  });

  it.skip('should return a normal search if no search facets are specified', function() {

  });

  it.skip('should retrieve facets along with the search results', function() {

  });
});