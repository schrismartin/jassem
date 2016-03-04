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

    var memory = null;

    this.compile = function (rawAssembly) {
      Memory.resetMemory();
      memory = Memory.memory();
      return memory;
    };

    this.stepForward = function () {
      Memory.push(12);
      Memory.push(123);
      Memory.push(1234);
    };

    this.stepBackward = function () {
      Memory.pop();
      Memory.pop();
      Memory.pop();
    }
  });
