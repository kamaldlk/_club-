/**
 * Created with JetBrains WebStorm.
 * User: Habib
 * Date: 11/12/15
 * Time: 12:56 PM
 * To change this template use File | Settings | File Templates.
 */
angular.module('cms.controllers')

    .controller("managerController", ["$scope", "$mdDialog", "$state", "api", "$stateParams", "toastr", function($scope, $mdDialog, $state, api, $stateParams, toastr) {

        $scope.view = true;

        $scope.getAllManager = function() {

            api.Manager.getAllManager(function(err, data) {
                if (data) {
                    $scope.managers = api.Manager.managers;
                    console.log(" data: ", data);
                }

            });
        }


        $scope.createManager = function(ev) {

            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'templates/dialog/create_manager.html',
                targetEvent: ev,
                clickOutsideToClose: true
            })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        }


        $scope.managerUpdate = function(ev, manager) {

            $mdDialog.show({
                controller: function($scope, api) {
                    api.Club.getAllClub(function(err, data) {

                        if (data) {
                            $scope.clubs = api.Club.allClub;
                            console.log(" data: ", data);
                        }

                    });

                    $scope.manager = manager;
                    $scope.updateButton = true;

                    console.log($scope.manager);

                    $scope.update = function(manager) {



                        $scope.manager.createdBy = "admin";


                        api.Manager.updateManager(manager, function(err, data) {


                            if (data) {

                                console.log("Updated :", JSON.stringify(data));
                                toastr.success(data.message, 'Success');

                            } else {
                                console.log("Updated :", JSON.stringify(err));
                                toastr.warning(err.errorCode, 'Warning');
                            }


                        })

                    }

                },
                templateUrl: 'templates/dialog/create_manager.html',
                targetEvent: ev,
                clickOutsideToClose: true
            })
                .then(function(answer) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
        }
        $scope.managerRemove = function(ev, manager) {


            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm();
            confirm.title('Would you like to remove Manager?')
            confirm.ariaLabel('Lucky day')
            confirm.targetEvent(ev)
            confirm.ok('Remove!')
            confirm.cancel('Cancel');
            $mdDialog.show(confirm).then(function() {

                api.Manager.removeManager(manager, function(err, data) {


                    if (data) {
                        toastr.success(data.message, "Successfully Removed");
                        console.log(data);
                    } else {
                        toastr.error(err.message, "error Removed");
                    }


                })

            }, function() {


            });


        }

        $scope.loggedDate = function(date) {

            return date.substring(0, 10);

        }


        function DialogController($scope, $mdDialog, api) {



            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };

            $scope.getClubList = function() {
                $scope.updateButton = false;
                api.Club.getAllClub(function(err, data) {

                    if (data) {
                        $scope.clubs = api.Club.allClub;
                        console.log(" data: ", data);
                    }

                });
            }
            $scope.save = function(manager) {


                $scope.manager.createdBy = "admin";

                console.log("Club Details :", JSON.stringify(manager));

                api.Manager.createManager(manager, function(err, data) {


                    if (data) {

                        console.log(JSON.stringify(data));
                        $scope.cancel();

                        $state.go("home.clubmanager");

                    } else {
                        console.log(JSON.stringify(err));
                    }


                })


            }
        }


    }])