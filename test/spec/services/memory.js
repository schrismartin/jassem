'use strict';

describe('Service: Memory', function () {

  // load the service's module
  beforeEach(module('jassemApp'));

  // instantiate service
  var Memory;
  beforeEach(inject(function (_Memory_) {
    Memory = _Memory_;
  }));

  it('should do something', function () {
    expect(!!Memory).toBe(true);
  });

});
