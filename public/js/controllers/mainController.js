/**
 * Created with JetBrains WebStorm.
 * User: Habib
 * Date: 11/12/15
 * Time: 12:34 PM
 * To change this template use File | Settings | File Templates.
 */
angular.module ('cms.controllers')

    .controller ("mainController", ["$scope", "$state", "api", "toastr", function ( $scope, $state, api, toastr ) {


        $scope.login = function ( users ) {

//            $state.go ("home.dashboard");
            console.log ("user :", JSON.stringify (users));

            api.User.signIn (users, function ( err, data ) {

                if ( data !== null ) {
                    toastr.success (data.success, 'Success');
                    $state.go ("home.clublist");
                } else {
                    toastr.error (err.errorCode, 'Error');
                }

            });

        }

        $scope.forgotPassword = function () {

            //$state.go("home.dashboard");
            console.log ("user forgot ");
        }

    }]);
