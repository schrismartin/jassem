'use strict';

/**
 * @ngdoc function
 * @name jassemApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jassemApp
 */
angular.module('jassemApp')
  .controller('MainCtrl', function (Program) {
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

    this.memory = {
      r0: 0x2,
      r1: 0x2,
      r2: 0x2,
      r3: 0x2,
      r4: 0x2,
      sp: 0x2,
      fp: 0x2,
      pc: 0x2,
      csr: 0x2,
      stack: [
        {
          'address': 0xfff434,
          'value': 0x2,
          'label': '',
          'isActive': false
        }
      ],
      global: []
    };

    //this.stack = {
    //    0xfff434: 0x0,
    //    0xfff438: 0x0,
    //    0xfff43c: 0x0,
    //    0xfff440: 0x1,
    //    0xfff444: 0x0
    //
    //};

    //this.stack = Memory.stack();

    //this.registers = Memory.registers;

    //this.r0 = Memory.r0();
    //this.r1 = Memory.r1();
    //this.r2 = Memory.r2();
    //this.r3 = Memory.r3();
    //this.r4 = Memory.r4();
    //this.sp = Memory.sp();
    //this.fp = Memory.fp();
    //this.fp = 0xfff434;
    //this.pc = Memory.pc();

    this.compile = function () {
      this.memory = Program.compile(this.assemCode);
    };

    //Memory.load(this.memory.stack[0].address, 'r0');

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

    //this.r0 = this.ld(this.fp + 12);
    //this.jsr();

    this.editorOptions = {
      lineWrapping : false,
      lineNumbers: true,
      theme: 'twilight',
      //readOnly: 'nocursor',
      //mode: 'xml',
    };

    this.cCode = "\
int a(int i, int j) {\n\
  int k;\n\
\n\
  if (i < j) {\n\
    k = i;\n\
  } else {\n\
    k = j;\n\
  }\n\
  return k;\n\
}";

    this.assemCode = "\
a:\n\
    push #4\n\
    ld [fp+12] -> %r0           / Load i into r0\n\
    ld [fp+16] -> %r1           / Load j into r0\n\
\n\
    cmp %r0, %r1                / Compare and branch on the negation (greater than or equal)\n\
    bge l1\n\
\n\
    ld [fp+12] -> %r0           / k = i\n\
    st %r0 -> [fp]\n\
    b l2\n\
\n\
    l1:\n\
      ld [fp+16] -> %r0           / k = j\n\
    st %r0 -> [fp]\n\
    l2:\n\
\n\
      ld [fp] -> %r0              / return k\n\
    ret";
  });
