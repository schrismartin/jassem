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
    this.memory = {
      r0: 0x0,
      r1: 0x0,
      r2: 0x0,
      r3: 0x0,
      r4: 0x0,
      sp: 0xfff434,
      fp: 0xfff434,
      pc: 0x0,
      csr: 0x0,
      stack: [
        {
          'address': 0xfff434,
          'value': 0x1,
          'label': '',
          'isActive': false
        }
      ],
      global: [
        //{
        //  'address': 0xfff434,
        //  'value': 0x0,
        //  'label': '',
        //  'isActive': false
        //}
      ]
    };
    //var sp = 0x0;
    //var fp = 0x0;
    //var pc = 0x0;
    //var csr = 0x0;
    //var ir = 0x0;
    //var g0 = 0x0;
    //var g1 = 0x1;
    //var gm1 = -1;
    var addressMap = function (memory) {
      var addrMap = {};
      memory.stack.forEach(function(stackVar) {
        addrMap[stackVar.address] = stackVar.value;
      });
      memory.global.forEach(function(globalVar) {
        addrMap[globalVar.address] = globalVar.value;
      });
      return addrMap;
    };
    //var addressMap = {
    //  0xfff434: 0x1
    //};
    //var stack = [
    //  {
    //    'address': 0xfff434,
    //    'value': 0x1,
    //    'label': '',
    //    'isActive': false
    //  }
    //];
    //var global = [
    //  //{
    //  //  'address': 0xfff434,
    //  //  'value': 0x0,
    //  //  'label': '',
    //  //  'isActive': false
    //  //}
    //];
    //var code = [
    //  //{
    //  //  'address': 0x1000,
    //  //  'value': 0x0,
    //  //  'label': '',
    //  //  'isActive': false
    //  //}
    //];

    this.load = function (address, register) {
      this.memory[register] = addressMap(this.memory)[address];
      //return this.memory;
    };

    this.pushStack = function (value) {
      var addr = stack[stack.length - 1].address;
      stack.push({
        'address': addr + 4,
        'value': value,
        'label': '',
        'isActive': false
      });
    };
    this.popStack = function () {
      stack.pop();
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
    this.sp = function () {
      return sp;
    };
    this.fp = function () {
      return fp;
    };
    this.pc = function () {
      return pc;
    };
    this.csr = function () {
      return csr;
    };
    this.stack = function () {
      return stack;
    };
    this.global = function () {
      return global;
    };
    this.code = function () {
      return code;
    };

  });
