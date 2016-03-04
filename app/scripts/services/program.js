'use strict';

/**
 * @ngdoc service
 * @name jassemApp.Program
 * @description
 * # Program
 * Service in the jassemApp.
 */
angular.module('jassemApp')
  .service('Program', function (Memory) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var code = [
      {
        'address': 0x1000,
        'value': 'push #4',
        'label': 'a:',
        'isActive': false
      },
      {
        'address': 0x1004,
        'value': 'ld [fp+12] -> %r0',
        'label': '',
        'isActive': false
      },
      {
        'address': 0x1008,
        'value': 'ld [fp+16] -> %r1',
        'label': '',
        'isActive': false
      }
    ];

    var memory = Memory.memory;

    this.compile = function (rawAssembly) {
      return memory;
    };

    this.stepForward = function () {

    };

    this.stepBackward = function () {

    }
  });
