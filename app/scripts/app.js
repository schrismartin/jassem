'use strict';

/**
 * @ngdoc overview
 * @name jassemApp
 * @description
 * # jassemApp
 *
 * Main module of the application.
 */
angular
  .module('jassemApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ui.bootstrap'
  ])
  .config(function ($stateProvider, $locationProvider, $urlRouterProvider) {
    $locationProvider.html5Mode({'enabled': true, 'requireBase': false}).hashPrefix('!');
    $urlRouterProvider.otherwise(function($injector, $location){
      $injector.invoke(['$state', function($state) {
        $state.go('404');
      }]);
    });

    $stateProvider
    .state('main',
      {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
    .state('about',
      {
        url: '/about',
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
    .state('contact',
      {
        url: '/contact',
        templateUrl: 'views/contact.html',
        title: 'Contact'
      })
    .state('404',
      {
        templateUrl: '404.html'
      })
    ;
  })
  .run(function ($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    });
