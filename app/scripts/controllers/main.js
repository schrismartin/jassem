'use strict';

/**
 * @ngdoc function
 * @name jassemApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jassemApp
 */
angular.module('jassemApp')
  .controller('MainCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

      this.testData = [
          'foo',
          'bar',
          'foobar'
      ]
      this.stack = {
          '0xfff434': 0x0,
          '0xfff438': 0x0,
          '0xfff43c': 0x0,
          '0xfff440': 0x0,
          '0xfff444': 0x0

      };

      this.addToStack = function (addr, value) {
          this.stack[addr] = value;
      };

    this.cCode = "int a(int i, int j) {\n\
  int k;\n\
\n\
  if (i < j) {\n\
    k = i;\n\
  } else {\n\
    k = j;\n\
  }\n\
  return k;\n\
}";

      //this.stack['0xfff448'] = 0x0
  });
