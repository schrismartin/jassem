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
      global: [
        {
          'address': 0x4,
          'value': 0x2,
          'label': 'i',
          'isActive': false
        }
      ]
    };

    this.code = [
      {
        'address': 0x1000,
        'value': 'push #4',
        'label': 'a:',
        'isActive': false
      }
    ];

    this.error = '';

    this.reset = function () {}
    ;

    this.compile = function () {
      this.error = '';
      this.memory = Program.compile(this.assemCode);
      this.code = Program.parseCode(this.assemCode);
    };
    this.stepForward = function () {
      try {
        Program.stepForward();
      }
      catch (e) {
        this.error = e.message;
      }
    };
    this.stepBackward = function () {
      this.error = '';
      Program.stepBackward();
    };

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

    this.assemblyEditorOptions = {
      lineWrapping : false,
      lineNumbers: true,
      matchBrackets: true,
      theme: 'solarized light',
      //keyMap: 'vim'
      //readOnly: 'nocursor',
      //mode: 'xml',
    };

    this.cCodeEditorOptions = {
      lineWrapping : false,
      lineNumbers: true,
      theme: 'solarized light',
      matchBrackets: true,
      mode: 'text/x-csrc',
      //keyMap: 'vim'
      //readOnly: 'nocursor',
    };

    this.letThereBeVIM = function () {
      this.assemblyEditorOptions['keyMap'] = 'vim';
      this.cCodeEditorOptions['keyMap'] = 'vim';
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

    this.assemCode = "a:\n\
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
