var should = require('should');
var db = require('../lib/databaseConnection');

describe('test mocha', function() {
  it('should have a initDbConnection method defined', function() {
    db.initDbConnection.should.be.defined;
  });
});
