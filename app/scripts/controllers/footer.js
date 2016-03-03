'use strict';

/**
 * @ngdoc function
 * @name jassemApp.controller:FooterCtrl
 * @description
 * # FooterCtrl
 * Controller of the jassemApp
 */
angular.module('jassemApp')
  .controller('FooterCtrl', function () {
    this.year = new Date().getFullYear();
  });
