'use strict';

describe('Service: Program', function () {

  // load the service's module
  beforeEach(module('jassemApp'));

  // instantiate service
  var Program;
  beforeEach(inject(function (_Program_) {
    Program = _Program_;
  }));

  it('should do something', function () {
    expect(!!Program).toBe(true);
  });

});
