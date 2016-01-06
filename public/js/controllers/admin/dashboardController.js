/**
 * Created with JetBrains WebStorm.
 * User: Habib
 * Date: 11/12/15
 * Time: 12:34 PM
 * To change this template use File | Settings | File Templates.
 */
angular.module ('cms.controllers')

    .controller ("dashboardController", ["$scope", "$state", "api", "toastr", "$localStorage", function ( $scope, $state, api, toastr, $localStorage ) {
        $scope.api = api;

        $scope.$storage = $localStorage;

        $scope.dashboardInit = function () {

            api.Club.getAllClub (function ( err, data ) {
                if ( data !== null ) {
                    api.Manager.getAllManager (function ( err, data ) {
                        if ( data !== null ) {
                            api.Member.getAll (function ( err, data ) {
                                if ( data !== null ) {

                                } else {
                                }

                            });
                        } else {
                        }

                    });
                } else {
                }

            });
        }


    }]);
