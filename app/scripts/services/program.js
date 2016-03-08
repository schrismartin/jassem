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

    /* I've implemented a simple parser using recursion to determine the type of function
       for each line. I use the type to classify it for a regex parser which then dissembles
       the string into necessary components, stored in the "operation" object.


     */

    var currentLabel = '';
    var currentAddress = 0x1000;

    var operations = [
      {
        'funcname': 'ld',
        'args': ['i', '%r0']
      }
    ];

    var code = [
      { // Basically same as 'symbol' object
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

    var formatOperation = function (operation) {
      var funcname = operation.funcname;
      var args = operation.args;
      switch(args.length) {
        case 0:
          return funcname;
        case 1:
          return "{0} {1}".format(funcname, args[0]);
        case 2:
          if (funcname == "cmp") {
            return "{0} {1}, {2}".format(funcname, args[0], args[1]);
          } else {
            return "{0} {1} -> {2}".format(funcname, args[0], args[1]);
          }
        case 3:
          return "{0} {1}, {2} -> {3}".format(funcname, args[0], args[1], args[2]);
      }
    };

    this.operations = function() {
      return operations;
    };

    this.parseCode = function (assemCode) {
      code = [];
      operations = [];
      currentAddress = 0x0ffc;
      var lines = assemCode.split("\n");
      var lineOperation;

      lines.forEach(function (line) {
        // Add symbol to code array
        line = line.replace(/(\/+.*)/gm, ''); // Strip comments
        line = line.trim();
        //code.push(this.parseLine(line, 0, ""));
        lineOperation = parseLine(line, 0, "");
        if(lineOperation != undefined) {
          addSymbol(lineOperation);
        }
        operations.push(lineOperation);
      });

      resetActive();
      return this.code();
    };

    var parseLine = function (line, index, substr) {
      // Determines function of line, formats for code,
      // then passes for component deconstruction

      var char = line.charAt(index);
      if(substr == "ret") { // Only instruction lacking a space
        var operation = getOperation(line, 0);
        return operation
      }
      if(index == line.length) { return; }

      switch(char) {
        case ':':
          setLabel(substr);
          return;
        case ' ':
          switch(substr) {
            // All 3-argument Commands
            case "add":
            case "sub":
            case "mul":
            case "idiv":
            case "imod":
              return getOperation(line, 3);
            // All 2-argument Commands
            case "ld":
            case "st":
            case "cmp":
            case "mov":
              return getOperation(line, 2);
            // All 1-argument Commands
            case "push":
            case "pop":
            case "jsr":
            case "b":
            case "bge":
              return getOperation(line, 1);
            default:
              break;
          }
        default:
          substr = substr.concat(char);
          return parseLine(line, index + 1, substr);
      }
    };

    var getOperation = function(str, numArgs) {
      // Takes line and disassembles into components using regex
      var regex;
      switch(numArgs) {
        case 0: regex = /^(\S+)$/g; break;
        case 1: regex = /^(\S+)\s+(\S+)$/g; break;
        case 2: regex = /^(\S+)\s+(\S+)\s*(?:,|\->)\s*(\S+)$/g; break;
        case 3: regex = /^(\S+)\s+(\S+)\s*,\s*(\S+)\s*->\s?(\S+)$/g; break;
        default: throw("OutOfBoundsException: Must provide number between 0 and 3. Found: " + numArgs);
      }

      var match = regex.exec(str);
      var object = {
        'funcname': match[1],
        'args': [],
        'label': currentLabel
      };
      currentLabel = undefined;
      for(var i = 2; i < 5; i++) {
        if (match[i] != undefined) object.args.push(match[i]);
      }
      console.log(object);
      return object;
    }

    var setLabel = function(label) {
      currentLabel = label;
    };

    var addSymbol = function(op) {
      var codeSymbol = {
        'address': currentAddress += 4,
        'value': formatOperation(op),
        'isActive': false,
        'label': op.label
      };
      code.push(codeSymbol);
    };

    var memory = null;
    var currentIndex = 0;

    var resetActive = function () {
      currentIndex = 0;
      code.forEach(function(codeVar) {
        codeVar.isActive = false;
      });
      code[currentIndex].isActive = true;
    };

    this.compile = function (rawAssembly) {
      Memory.resetMemory();
      memory = Memory.memory();
      return memory;
    };

    this.stepForward = function () {
      if (currentIndex == code.length - 1) { return; }
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

    String.prototype.format = function() {
      var content = this;
      for (var i=0; i < arguments.length; i++)
      {
        var replacement = '{' + i + '}';
        content = content.replace(replacement, arguments[i]);
      }
      return content;
    };
  });
