/**
 * Created with JetBrains WebStorm.
 * User: Habib
 * Date: 11/12/15
 * Time: 12:34 PM
 * To change this template use File | Settings | File Templates.
 */
angular.module('cms.controllers')

.controller("authentication",["$scope","$state",function($scope,$state){

        $scope.value2 = "Working";


        $scope.login = function(){

              $state.go("home.dashboard");
        }



    }]) ;