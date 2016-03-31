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
    var memory = null;
    var currentIndex = 0;
    var currentLabel = undefined;
    var currentAddress = 0x1000;


    var operations = [
      {
        'funcname': 'ld',
        'args': ['i', '%r0'],
        'label': undefined
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

    var getIndexFromAddress = function(address) {
      for(var i = 0; i < code.length; i++) {
        if(code[i].address == address) {
          return i;
        }
      }
    };

    var getIndexFromLabel = function(label) {
      for(var i = 0; i < code.length; i++) {
        if(code[i].label == label) {
          return i - 1;
        }
      }
    };

    this.jumpToAddress = function(address) {
      var newIndex = getIndexFromAddress(address);
      console.log("new index = " +newIndex);
      var oldIndex = getIndexFromAddress(currentAddress);
      console.log("old index = " +oldIndex);
      code[newIndex].isActive = true;
      code[oldIndex].isActive = false;
      currentAddress = address;
      currentIndex = newIndex;
    };

    this.jumpToLabel = function(label) {
      var newIndex = getIndexFromLabel(label);
      console.log(newIndex);
      console.log(currentIndex);
      code[newIndex].isActive = true;
      code[currentIndex].isActive = false;

      currentAddress = code[newIndex].address;
      currentIndex = newIndex;
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
        try {
          lineOperation = parseLine(line, 0, "");
        } catch(error) {
          throw(error);
        }
        if(lineOperation != undefined) {
          addSymbol(lineOperation);
          operations.push(lineOperation);
        }
      });

      try {
        var mainIndex = resetActive();
        Memory.setPC(code[mainIndex].address);
      } catch(problem) {
        throw(problem);
      }
      return this.code();
    };

    var parseLine = function (line, index, substr) {
      // Determines function of line, formats for code,
      // then passes for component deconstruction

      var char = line.charAt(index);
      if(substr == "ret") { // Only instruction lacking a space delimiter
        var operation = getOperation(line, 0);
        return operation
      }
      if(index == line.length) { return; }

      try {
        switch (char) {
          case ':':
            setLabel(substr);
            return;
          case ' ':
            switch (substr) {
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
      } catch(error) {
        throw(error);
      }
    };

    var getOperation = function(str, numArgs) {
      // Takes line and disassembles into components using regex
      var regex;
      switch (numArgs) {
        case 0:
          regex = /^(\S+)$/g;
          break;
        case 1:
          regex = /^(\S+)\s+(\S+)$/g;
          break;
        case 2:
          regex = /^(\S+)\s+(\S+)\s*(?:,|\->)\s*(\S+)$/g;
          break;
        case 3:
          regex = /^(\S+)\s+(\S+)\s*,\s*(\S+)\s*->\s?(\S+)$/g;
          break;
      }

      try {
        var match = regex.exec(str);
      } catch(error) {
        throw("Invalid Line: " + str);
      }
      var object = {
        'funcname': match[1],
        'args': [],
        'label': currentLabel
      };

      currentLabel = undefined;
      for(var i = 2; i < 5; i++) {
        if (match[i] != undefined) object.args.push(match[i]);
      }
      return object;
    };

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

    var resetActive = function () {
      // Reset highlight to main label and disable all others
      // Returns: Index of first line of main function
      currentIndex = -1;
      for(var i = 0; i < operations.length; i++) {
        if(operations[i] != undefined && operations[i].label == "main") {
          if(currentIndex != -1) { throw("Error: Code cannot have multiple main labels."); }
          currentIndex = i;
          currentAddress = 0x1000 + currentIndex * 4;
        }
      }

      if(currentIndex == -1) { throw("Error: Code must have a main label") }

      code.forEach(function(codeVar) {
        codeVar.isActive = false;
      });
      code[currentIndex].isActive = true;
      return currentIndex;
    };

    this.compile = function (rawAssembly) {
      Memory.resetMemory();
      memory = Memory.memory();
      return memory;
    };

    this.stepForward = function () {
      if (currentIndex == code.length - 1) {
        // Check to see if string is ret, do shit
        return;
      }

      var currentOperation = operations[currentIndex];
      var command = currentOperation.funcname;
      var args = currentOperation.args;
      console.log(currentOperation);

      if(command == "jsr") { // Subroutine
        var label = args[1];
        this.jumpToLabel(label);
        Memory[command](currentOperation);
      } else if(command == "ret") { // return from subroutine
        Memory[command](currentOperation);
        this.jumpToAddress(Memory.memory().pc)
      } else {
        code[currentIndex].isActive = false;
        currentIndex++;
        currentAddress += 4;
        code[currentIndex].isActive = true;
        Memory[command](currentOperation);
      }
      Memory.setPC(currentAddress);
    };

    this.stepBackward = function () {
      if (currentIndex == 0) return;
      code[currentIndex].isActive = false;
      currentIndex--;
      code[currentIndex].isActive = true;
      Memory.setPC(currentAddress);
    };

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
