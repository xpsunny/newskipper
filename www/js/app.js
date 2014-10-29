'use strict';

/**
 * @ngdoc overview
 * @name angNewsApp
 * @description
 * # angNewsApp
 *
 * Main module of the application.
 */

var myApp = angular.module('myApp', [
    'ngRoute',
  ]);

  myApp.config(function ($routeProvider) {

  });

myApp.controller('MainCtrl',['$scope','$location', function($scope){
  //initialize
  if(localStorage.getItem("locationFlag")==null){
    localStorage.setItem("locationFlag",false);
  }
  if(localStorage.getItem("alarmFlag")==null){
    localStorage.setItem("alarmFlag",false);
  }

  $scope.locat = localStorage.getItem("locationFlag");
  $scope.alarm = localStorage.getItem("alarmFlag");

  $scope.myLocation = localStorage.getItem("location");

}]);

