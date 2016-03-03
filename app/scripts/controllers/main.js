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
    ];

    this.stack = {
        0xfff434: 0x0,
        0xfff438: 0x0,
        0xfff43c: 0x0,
        0xfff440: 0x1,
        0xfff444: 0x0

    };

    this.r0 = 0x0;
    this.r1 = 0x0;
    this.r2 = 0x0;
    this.r3 = 0x0;
    this.r4 = 0x0;
    this.sp = 0x0;
    this.fp = 0xfff434;
    this.pc = 0x0;

    this.runtimeStack = [
      {
        'instruction': "push #4",
        'reverse_instruction': "pop #4",
        'fp': {
          'to': 0x32,
          'from': 0x23
        },
        'sp': {
          'to': 0x32,
          'from': 0x23
        },
      },

    ]

    this.pushToStack = function (addr, value) {
      this.stack[addr] = value;
    };

    this.ld = function (addr) {
      return this.stack[addr];
    };

    this.jsr = function () {
      this.pushToStack(0xfff448, 12);
      this.pushToStack(0xfff44c, 123);
      this.pushToStack(0xfff450, 1234);
    };

    this.r0 = this.ld(this.fp + 12);
    this.jsr();

    this.editorOptions = {
      lineWrapping : true,
      lineNumbers: true,
      theme: 'twilight',
      //readOnly: 'nocursor',
      //mode: 'xml',
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

    this.assemCode = "asdf int a(int i, int j) {\n\
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
