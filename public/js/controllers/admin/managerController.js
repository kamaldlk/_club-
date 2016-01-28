/**
 * Created with JetBrains WebStorm.
 * User: Habib
 * Date: 11/12/15
 * Time: 12:56 PM
 * To change this template use File | Settings | File Templates.
 */
angular.module ('cms.controllers')

    .controller ("managerController", ["$scope", "$mdDialog", "$state", "api", "$stateParams", "toastr", "Upload", function ( $scope, $mdDialog, $state, api, $stateParams, toastr, Upload ) {

        $scope.api = api;
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

                        }

                    });
                    $scope.manager = {
                        profile: {}
                    };

                    $scope.uploadFile = function () {
                        api.ProfilePic.adminUserUpload ($scope.file, function ( error, data ) {

                            if ( data ) {
                                $scope.manager.profile.profilePic = data.data.filePath;
                                console.log (data);
                            } else {

                            }

                        })

                    };


                    $scope.updateButton = true;

                    $scope.cancel = function () {
                        $mdDialog.cancel ();
                    };

                    $scope.update = function ( manager ) {
                        if(!manager.profile.firstName || !manager.profile.lastName || !manager.address.address1 || !manager.address.address2 || !manager.address.city || !manager.address.state || !manager.address.country || !manager.address.pin || !manager.profile.mobile || !manager.profile.email)
                            toastr.warning ("Fields shouldn't be empty", "Warning");
                        else {
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


        function DialogController ( $scope, $mdDialog, api, Upload ) {

            $scope.hide = function () {
                $mdDialog.hide ();
            };
            $scope.cancel = function () {
                $mdDialog.cancel ();
            };
            $scope.answer = function ( answer ) {
                $mdDialog.hide (answer);
            };

            $scope.manager = {
                profile: {}
            };

            $scope.getClubList = function () {
                $scope.updateButton = false;
                api.Club.getAllClub (function ( err, data ) {
                    if ( data ) {
                        // console.log ('managers ', api.Manager.managers);

                        // var tempClub, tempClubList = [];
                        // _.each (api.Manager.managers, function ( manager ) {
                        //     tempClub = _.findWhere (api.Club.allClub, {clubName: manager.club.clubName});
                        //     if ( tempClub )
                        //         tempClubList.push (tempClub);

                        // });
                        $scope.clubs = data;
                        console.log (" filtered club: ", $scope.clubs);
                    }

                });
            }

            $scope.uploadFile = function () {
                api.ProfilePic.adminUserUpload ($scope.file, function ( error, data ) {
                    if ( data ) {
                        $scope.manager.profile.profilePic = data.data.filePath;
                        console.log (data);
                    } else {

                    }

                })

            };


            $scope.save = function ( manager ) {
                if(!manager.profile.firstName || !manager.profile.lastName || !manager.userName || !manager.password || !manager.club.clubName || !manager.address.address1 || !manager.address.address2 || !manager.address.city || !manager.address.state || !manager.address.country || !manager.address.pin || !manager.profile.mobile || !manager.profile.email)
                    toastr.warning ("Fields shouldn't be empty", "Warning");
                else {
                    $scope.manager.createdBy = "admin";
                    $scope.manager.club = manager.club.clubName;
                    console.log ("Club Details :", JSON.stringify (manager));
                    if(!$scope.manager.profile.profilePic){
                        $scope.manager.profile.profilePic = "images/user_avatar.jpg";
                    }
                    api.Manager.createManager (manager, function ( err, data ) {
                        if ( data ) {
                            console.log (JSON.stringify (data));
                            toastr.success (data.message, "Successfully Created");
                            api.Manager.getAllManager (function ( err, data ) {
                                if ( data ) {
                                    $scope.managers = api.Manager.managers;
                                    console.log (" data: ", data);
                                }
                            });
                            $scope.cancel ();
                            $state.go ("home.clubmanager");
                        } 
                        else {
                            console.log (JSON.stringify (err));
                            toastr.error (err.errorCode, "Error");
                        }
                    });
                }

            }
        }


    }])