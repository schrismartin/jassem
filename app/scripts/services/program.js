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
        'isActive': true
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

    this.code = function () {
      return code;
    };

    var memory = null;
    var currentIndex = 0;

    var resetActive = function () {
      currentIndex = 0;
      code.forEach(function(codeVar) {
        codeVar['isActive'] = false;
      });
      code[currentIndex].isActive = true;
    };

    this.compile = function (rawAssembly) {
      Memory.resetMemory();
      resetActive();
      memory = Memory.memory();
      return memory;
    };

    this.stepForward = function () {
      if (currentIndex == code.length - 1) return;
      code[currentIndex].isActive = false;
      currentIndex++;
      code[currentIndex].isActive = true;
      Memory.push(12);
      Memory.push(123);
      Memory.push(1234);
    };

    this.stepBackward = function () {
      if (currentIndex == 0) return;
      code[currentIndex].isActive = false;
      currentIndex--;
      code[currentIndex].isActive = true;
      Memory.pop();
      Memory.pop();
      Memory.pop();
    }
  });
