'use strict';

/**
 * @ngdoc filter
 * @name jassemApp.filter:hex
 * @function
 * @description
 * # hex
 * Filter in the jassemApp.
 */
angular.module('jassemApp')
  .filter('hex', function () {
    return function (input) {
      return "0x" + Number(input).toString(16);
    };
  });
