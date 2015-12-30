/**
 * Created with JetBrains WebStorm.
 * User: Habib
 * Date: 11/12/15
 * Time: 12:34 PM
 * To change this template use File | Settings | File Templates.
 */
angular.module('cms.controllers')

    .controller("function",["$scope","$state",function($scope,$state){

        /*
         Super Admin Controllers

             MainController
                 Login
                 forgotpassword

             ClubController
                 List of clubs
                 Create Club
                 Update Club
                 Add Manager
                 Remove Club
                 Search Club

             ManagerController
                 List of manager
                 Create Manager
                 Update Manager
                 Remove Manager
                 Search Manager

 */


        //SuperAdmin


        //CLUB FUNCTION

        $scope.createClub = function(){}
        $scope.updateClub = function(){}
        $scope.removeClub = function(){}
        $scope.searchClub = function(){}

        //MANAGER FUNCTION

        $scope.createManager = function(){}
        $scope.updateManager = function(){}
        $scope.removeManager = function(){}
        $scope.searchManager = function(){}


        //MAIN FUNCTIONS

        $scope.login = function(){}
        $scope.forgetPassword = function(){}


        //CURRENCY FUNCTIONS

        $scope.addCurrency = function(){}
        $scope.updateCurrency = function(){}
        $scope.removeCurrency = function(){}


        //OFFER CONFIGURATION FUNCTIONS

        $scope.updateOffer = function(){}

        //DASHBOARD FUNCTIONS

        /*
         Total Number of clubs
         Total Number of Customers
         Total Number of Managers
         Total Number of Customers
         */

        //Manager Admin

        //MEMBER FUNCTION

        $scope.createMember = function(){}
        $scope.updateMember = function(){}
        $scope.searchMember = function(){}

        //MEMBER ENTRY

        $scope.memberEntry = function(){} //new customer/existing ,

        //MAIN FUNCTION

        $scope.login = function(){}
        $scope.forgetPassword = function(){}




    }]) ;