'use strict';

describe('Filter: hex', function () {

  // load the filter's module
  beforeEach(module('jassemApp'));

  // initialize a new instance of the filter before each test
  var hex;
  beforeEach(inject(function ($filter) {
    hex = $filter('hex');
  }));

  it('should return the input as hexadecimal', function () {
    expect(hex(0)).toBe('0x0');
    expect(hex(9)).toBe('0x9');
    expect(hex(10)).toBe('0xa');
    expect(hex(15)).toBe('0xf');
    expect(hex(16)).toBe('0x10');
  });

});
