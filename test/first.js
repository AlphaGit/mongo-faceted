var should = require('should');

describe('test mocha', function() {
  it('should do something', function() {
    true.should.be.true;
  });

  it('should do something else', function() {
    (1).should.be.a.Number;
  });
});
