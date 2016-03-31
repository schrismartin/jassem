'use strict';

/**
 * @ngdoc service
 * @name jassemApp.Memory
 * @description
 * # Memory
 * Service in the jassemApp.
 */
angular.module('jassemApp')
  .service('Memory', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function

    //TODO: I don't know how I feel about memory model right now. It works but might fall apart once we start implementing things\

    var memory;

    this.memory = function () {
      return memory;
    };

    this.resetMemory = function () {
      memory = {
        r0: 0x0,
        r1: 0x0,
        r2: 0x0,
        r3: 0x0,
        r4: 0x0,
        _sp: 0xfff448,
        set sp(addr) {
          console.log("SP Setting");
          var oldIndex = getStackIndexFromAddress(memory.sp);
          var newIndex = getStackIndexFromAddress(addr);
          memory.stack[oldIndex].highlight = memory.fp == memory.sp ? 'fp' : '';
          memory.stack[newIndex].highlight = memory.fp == addr ? 'both' : 'sp';
          console.log("SP Set from " +memory.sp.toString(16)+ " to " +addr.toString(16));
          memory._sp = addr;
        },
        _fp: 0xfff448,
        get sp() {
          return memory._sp;
        },
        set fp(addr) {
          console.log("FP Setting");
          var oldIndex = getStackIndexFromAddress(memory.fp);
          var newIndex = getStackIndexFromAddress(addr);
          memory.stack[oldIndex].highlight = memory.sp == memory.fp ? 'sp' : '';
          memory.stack[newIndex].highlight = memory.sp == addr ? 'both' : 'fp';
          memory._fp = addr;
          console.log("FP Set from " +memory.fp.toString(16)+ " to " +addr.toString(16));
        },
        get fp() {
          return memory._fp;
        },
        _pc: 0x1000,
        set pc(addr) {
          console.log("PC Setting");
          memory._pc = addr;
          console.log("PC Set from "+memory.pc.toString(16)+ " to " +addr.toString(16));
        },
        get pc() {
          return memory._pc
        },
        csr: 0x0,
        stack: [
          {
            'address': 0xfff448,
            'value': 0x0,
            'label': '',
            'highlight': ''
          }
        ],
        global: [
          {
            'address': 0x4,
            'value': 0x2,
            'label': 'i',
            'highlight': ''
          }
        ]
      };

      memory.fp = 0xfff448;
      memory.sp = 0xfff448;
      memory.pc = 0x1000;
    };

    var addressMap = function () {
      var addrMap = {};
      memory.stack.forEach(function(stackVar) {
        addrMap[stackVar.address] = stackVar.value;
      });
      memory.global.forEach(function(globalVar) {
        addrMap[globalVar.address] = globalVar.value;
      });
      return addrMap;
    };

    var addLineToStack = function(numlines) {
      if(numlines == undefined) { numlines = 1;}
      for(var i = 0; i < numlines; i++) {
        try {
          var addr = memory.stack[memory.stack.length - 1].address;
        }
        catch (e) {
          throw new Error("Memory Corruption!");
        }

        memory.stack.push({
          'address': addr - 4,
          'value': 0x0,
          'label': '',
          'highlight': ''
        });
      }
    };

    this.setPC = function(newPC) {
      memory.pc = newPC;
    };

    var getStackIndexFromAddress = function(address) {
      for(var i = 0; i < memory.stack.length; i++) {
        if(memory.stack[i].address == address) {
          return i;
        }
      }
      return -1;
    };

    var setRegister = function(register, value) {
      register = register.replace('%','');
      memory[register] = value;
    };

    var getRegister = function(register) {
      register = register.replace('%','');
      return memory[register];
    }

    var parseConst = function(token) {
      return token.replace('#', '');
    };

    var incdecReg = function(token, reg) {
      if(token != undefined) {
        var rv;
        if(token == '--') {
          rv = memory[reg] - 4;
        } else if(token == '++') {
          rv = memory[reg] + 4;
        }

        var index = getStackIndexFromAddress(rv);
        if(index == -1) {
          addLineToStack();
        }

        memory[reg] = rv;
      }
    };

    var parsePointer = function(token) {
      var regex = /^([\-+]{2})?\[([a-z0-9]+)([+-])?([0-9]+)?\]([\-+]{2})?$/g;
      var match = regex.exec(token);
      var incdecBeg = match[1];
      var reg = match[2];

      // Incdec beginning before addr is called
      incdecReg(incdecBeg, reg);
      var addr = memory[reg];
      var op = match[3];
      var offset = match[4] != undefined ? parseInt(match[4]) : 0;
      var incdecEnd = match[5];

      // Handle pointer offset
      if(op != undefined) {
        if(op == '+') {
          addr = addr + offset
        } else if(op == '-') {
          addr = addr - offset
        }
      }
      incdecReg(incdecEnd, reg);
      return addr;
    };

    var parseToken = function(token) {
      if (token.charAt(0) == '#') { // Handle constants
        console.log("Constant Detected");
        var rv = parseConst(token);
        console.log("Constant Resolved: " +token+ " converted to " +rv);
        return rv;
      }
      if(token.match(/^([\-+]{2})?\[([a-z]+)([+-])?([0-9]+)?\]([\-+]{2})?$/g) != undefined) { // Handle Pointers
        console.log("Pointer Detected");
        var rv = parsePointer(token);
        console.log("Pointer Resolved: " +token+ " converted to 0x" + rv.toString(16));
        return rv;
      }
    };

    var setStackValueAtAddress = function(value, addr) {
      var index = getStackIndexFromAddress(addr);
      memory.stack[index].value = value;
    };

    var getStackValueAtAddress = function(addr) {
      var index = getStackIndexFromAddress(addr);
      return memory.stack[index].value;
    };

    this.ld = function (operation) {
      var ptr = operation.args[0];
      var reg = operation.args[1];

      var addr = parseToken(ptr);
      console.log(addr);
      var index = getStackIndexFromAddress(addr);
      console.log(index);
      var ptrval = memory.stack[index].value;
      console.log(ptrval);

      setRegister(reg, ptrval);
    };

    this.st = function (operation) {
      var reg = operation.args[0];
      var addr = operation.args[1];
      var val = parseToken(addr);
      var index = getStackIndexFromAddress(val);
      memory.stack[index].value = getRegister(reg);
    };

    this.push = function (operation) {
      var num = parseToken(operation.args[0]) / 4;
      for(var i = 0; i < num; i++) {
        addLineToStack();
        memory.sp -= 4;
      }
    };

    this.pop = function (operation) {
      var num = parseToken(operation.args[0]) / 4;
      for(var i = 0; i < num; i++) {
        memory.sp += 4;
      }
    };
    this.jsr = function (operation) {
      addLineToStack(3);

      //memory.sp -= 4;
      setStackValueAtAddress(memory.pc + 4, memory.sp);
      memory.sp -= 4;
      setStackValueAtAddress(memory.fp, memory.sp);
      memory.sp -= 4;
      memory.fp = memory.sp
    };
    this.ret = function (operation) {
      memory.sp += 4;
      memory.fp = getStackValueAtAddress(memory.sp);
      memory.sp += 4;
      memory.pc = getStackValueAtAddress(memory.sp);

    };
    this.cmp = function (operation) {

    };
    this.mov = function (operation) {
      var val = parseToken(operation.args[0]);
      var reg = operation.args[1];
      setRegister(reg, val);
    };
    this.add = function (operation) {
      var firstreg = operation.args[0];
      var secondreg = operation.args[1];
      var store = operation.args[2];

      var val1 = parseInt(getRegister(firstreg));
      var val2 = parseInt(getRegister(secondreg));
      var sum = val1 + val2;
      setRegister(store, sum);
    };
    this.sub = function (operation) {
      var firstreg = operation.args[0];
      var secondreg = operation.args[1];
      var store = operation.args[2];

      var val1 = parseInt(getRegister(firstreg));
      var val2 = parseInt(getRegister(secondreg));
      var sub = val1 - val2;
      setRegister(store, sub);
    };
    this.mul = function (operation) {
      var firstreg = operation.args[0];
      var secondreg = operation.args[1];
      var store = operation.args[2];

      var val1 = parseInt(getRegister(firstreg));
      var val2 = parseInt(getRegister(secondreg));
      var prod = val1 * val2;
      setRegister(store, prod);
    };
    this.idiv = function (operation) {
      var firstreg = operation.args[0];
      var secondreg = operation.args[1];
      var store = operation.args[2];

      var val1 = parseInt(getRegister(firstreg));
      var val2 = parseInt(getRegister(secondreg));
      var div = Math.floor(val1 / val2);
      setRegister(store, div);
    };
    this.imod = function (operation) {
      var firstreg = operation.args[0];
      var secondreg = operation.args[1];
      var store = operation.args[2];

      var val1 = parseInt(getRegister(firstreg));
      var val2 = parseInt(getRegister(secondreg));
      var mod = val1 % val2;
      setRegister(store, mod);
    };


    //this.r0 = function () {
    //  return registers.r0;
    //};
    //this.r1 = function () {
    //  return registers.r1;
    //};
    //this.r2 = function () {
    //  return registers.r2;
    //};
    //this.r3 = function () {
    //  return registers.r3;
    //};
    //this.r4 = function () {
    //  return registers.r4;
    //};
    //this.sp = function () {
    //  return sp;
    //};
    //this.fp = function () {
    //  return fp;
    //};
    //this.pc = function () {
    //  return pc;
    //};
    //this.csr = function () {
    //  return csr;
    //};
    //this.stack = function () {
    //  return stack;
    //};
    //this.global = function () {
    //  return global;
    //};
    //this.code = function () {
    //  return code;
    //};

  });
