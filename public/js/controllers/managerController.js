/**
 * Created with JetBrains WebStorm.
 * User: Habib
 * Date: 11/12/15
 * Time: 12:56 PM
 * To change this template use File | Settings | File Templates.
 */
angular.module ('cms.controllers')

    .controller ("managerController", ["$scope", "$mdDialog", "$state", "api", "$stateParams", "toastr", function ( $scope, $mdDialog, $state, api, $stateParams, toastr ) {

        $scope.view = true;
        $scope.selectedMenu = 'managerlist';
        $scope.getAllManager = function () {

            api.Manager.getAllManager (function ( err, data ) {
                if ( data ) {
                    $scope.managers = api.Manager.managers;
                    console.log (" data: ", data);
                }

            });
        }


        $scope.createManager = function ( ev ) {

            $mdDialog.show ({
                controller: DialogController,
                templateUrl: 'templates/admin/dialog/create_manager.html',
                targetEvent: ev,
                clickOutsideToClose: true
            })
                .then (function ( answer ) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        }


        $scope.managerUpdate = function ( ev, manager ) {

            $mdDialog.show ({
                controller: function ( $scope, api, manager ) {
                    api.Club.getAllClub (function ( err, data ) {

                        if ( data ) {
                            $scope.manager = manager;
                            $scope.clubs = api.Club.allClub;
                            console.log ('manager value is ', $scope.manager);
                            console.log (" data: ", data);
                        }

                    });


                    $scope.updateButton = true;

                    $scope.cancel = function () {
                        $mdDialog.cancel ();
                    };

                    $scope.update = function ( manager ) {


                        $scope.manager.createdBy = "admin";


                        var userName = $scope.manager.userName;
                        $scope.manager.clubName = $scope.manager.club.clubName;

                        delete $scope.manager.userName;
                        delete $scope.manager.club;


                        api.Manager.updateManager (manager, userName, function ( err, data ) {


                            if ( data ) {

                                console.log ("Updated :", JSON.stringify (data));
                                toastr.success (data.message, 'Successfully Updated');
                                $mdDialog.cancel ();


                            } else {
                                console.log ("Updated :", JSON.stringify (err));
                                toastr.warning (err.errorCode, 'Warning');
                            }


                        })

                    }

                },
                templateUrl: 'templates/admin/dialog/create_manager.html',
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    manager: manager
                }
            })
                .then (function ( answer ) {
                    $scope.status = 'You said the information was "' + answer + '".';
                }, function () {
                    $scope.status = 'You cancelled the dialog.';
                });
        }
        $scope.managerRemove = function ( ev, manager ) {


            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm ();
            confirm.title ('Would you like to remove Manager?')
            confirm.ariaLabel ('Lucky day')
            confirm.targetEvent (ev)
            confirm.ok ('Remove!')
            confirm.cancel ('Cancel');
            $mdDialog.show (confirm).then (function () {

                api.Manager.removeManager (manager, function ( err, data ) {


                    if ( data ) {
                        toastr.success (data.message, "Successfully Removed");
                        console.log (data);
                    } else {
                        toastr.error (err.message, "error Removed");
                    }


                })

            }, function () {


            });


        }

        $scope.loggedDate = function ( date ) {

            return date.substring (0, 10);

        }


        function DialogController ( $scope, $mdDialog, api ) {


            $scope.hide = function () {
                $mdDialog.hide ();
            };
            $scope.cancel = function () {
                $mdDialog.cancel ();
            };
            $scope.answer = function ( answer ) {
                $mdDialog.hide (answer);
            };

            $scope.getClubList = function () {
                $scope.updateButton = false;
                api.Club.getAllClub (function ( err, data ) {

                    if ( data ) {
                        console.log ('managers ', api.Manager.managers);


                        var tempClub, tempClubList = [];
                        _.each(api.Manager.managers, function ( manager ) {

                            tempClub = _.findWhere (api.Club.allClub, {clubName: manager.club.clubName});
                            if ( tempClub )
                                tempClubList.push (tempClub);

                        });
                        $scope.clubs = _.difference (api.Club.allClub, tempClubList);
                        console.log (" filtered club: ", $scope.clubs);
                    }

                });
            }
            $scope.save = function ( manager ) {

                $scope.manager.createdBy = "admin";

                $scope.manager.club = manager.club.clubName;
                console.log ("Club Details :", JSON.stringify (manager));

                api.Manager.createManager (manager, function ( err, data ) {


                    if ( data ) {

                        console.log (JSON.stringify (data));
                        toastr.success (data.message, "Successfully Created");
                        $scope.cancel ();

                        $state.go ("home.clubmanager");

                    } else {
                        console.log (JSON.stringify (err));
                        toastr.error (err.errorCode, "Error");
                    }


                })

//                if ( manager.profile.firstName || manager.profile.lastName || manager.profile.email || manager.profile.mobile ) {
//
//                    toastr.warning ("Fields required", "Warning");
//                    console.log (manager);
//
//                } else {
//
//                }

            }
        }


    }])