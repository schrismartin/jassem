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
      r0: 0x0,
      r1: 0x0,
      r2: 0x0,
      r3: 0x0,
      r4: 0x0,
      sp: 0xfff448,
      fp: 0xfff448,
      pc: 0x1000,
      csr: 0x0,
      stack: [
        {
          'address': 0xfff448,
          'value': 0x2,
          'label': '',
          'highlight': 'both'
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
    this.success = '';

    this.reset = function () { };

    this.compile = function () {
      this.error = '';
      try {
        this.memory = Program.compile(this.assemCode);
        this.code = Program.parseCode(this.assemCode);

      } catch(error) {
        this.error = error;
      }
    };

    this.stepForward = function () {
      // try {
        Program.stepForward();
      // }
      // catch (e) {
      //   this.error = e.message;
      // }
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

    this.cCode = "int a(int *p) {\n\
    return *p;\n\
}\n\
\n\
main() {\n\
    int i, j;\n\
\n\
    j = 15;\n\
    i = a(&j);\n\
};";

    this.assemCode = "a:\n\
    ld [fp+12] -> %r0      / get p's value\n\
    ld [r0] -> %r0         / dereference it\n\
    ret\n\
\n\
main:\n\
    push #8\n\
\n\
    mov #15 -> %r0         / j = 15\n\
    st %r0 -> [fp]\n\
\n\
    st %fp -> [sp]--       / push &j on the stack\n\
    jsr a                  / and call a()\n\
    pop #4\n\
    st %r0 -> [fp-4]\n\
\n\
    ret";
  });
