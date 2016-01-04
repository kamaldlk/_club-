/**
 * Created with JetBrains WebStorm.
 * User: Habib
 * Date: 11/12/15
 * Time: 12:34 PM
 * To change this template use File | Settings | File Templates.
 */
angular.module ('cms.controllers')

    .controller ("masterController", ["$scope", "$state", "api", "toastr", "$localStorage", function ( $scope, $state, api, toastr, $localStorage ) {

        $scope.$storage = $localStorage;

        $scope.login = function ( users ) {

            console.log ("user :", JSON.stringify (users));

            api.User.signIn (users, function ( err, data ) {

                if ( data !== null ) {
                    toastr.success ("Loggedin", 'Success');
                    if ( data.role === "admin" ) {
                        $scope.$storage.adminUsers = data;
                        $state.go ("home.clublist");

                    } else {
                        $scope.$storage.adminUsers = data;

                        api.Offer.Get(function(err,data){})

                        $state.go ("manager.memberlist");
                        console.log(api.Offer.offers)

                    }


                } else {
                    toastr.error (err.errorCode, 'Error');
                }

            });

        }

        $scope.forgotPassword = function () {

            //$state.go("home.dashboard");
            console.log ("user forgot ");
        }

        $scope.logout = function () {
            $scope.$storage.adminUsers = "";
            $state.go ("authentication");


        }

    }]);
