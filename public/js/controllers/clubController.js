/**
 * Created with JetBrains WebStorm.
 * User: Habib
 * Date: 11/12/15
 * Time: 12:56 PM
 * To change this template use File | Settings | File Templates.
 */
angular.module ('cms.controllers')

    .controller ("clubController", ["$scope", "$mdDialog", "$state", "api", "$stateParams", "toastr", function ( $scope, $mdDialog, $state, api, $stateParams, toastr ) {

        $scope.view = true;
        $scope.selectedMenu = 'clublist';
        $scope.updateButton = false;
        $scope.images = ["images/clubImages/drinks.jpg", "images/clubImages/club_dance_hands_blue.jpg", "images/clubImages/club_dance_hands_yellow.jpg", "images/clubImages/hand_beer.jpg", "images/clubImages/party_cheers.jpg", "images/clubImages/party_fun_all.jpeg"];
        $scope.clubId = $stateParams.clubId;

        if ( $stateParams.clubId ) {
            $scope.updateButton = true;
            $scope.club = _.findWhere (api.Club.allClub, {_id: $stateParams.clubId});

        }

        $scope.getAllClubList = function () {

            api.Club.getAllClub (function ( err, data ) {

                if ( data ) {
                    $scope.clubs = api.Club.allClub;
                    console.log (" data: ", data);
                }

            });
        }

        $scope.getAllCurrencyList = function () {

            api.Currency.getAll (function ( err, data ) {

                if ( data ) {

                    $scope.currencyData = api.Currency.allCountries;
                    console.log ($scope.currencyData)

                }

            });
        }


        $scope.createClub = function () {
            $state.go ("home.createclub");
        }

        $scope.editClub = function ( club ) {
            $state.go ("home.createclub", {clubId: club._id});
            console.log ("edit Club", club.clubName);
        }


        $scope.removeClub = function ( ev, club ) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm ();
            confirm.title ('Would you like to remove club?')
            confirm.ariaLabel ('Lucky day')
            confirm.targetEvent (ev)
            confirm.ok ('Remove!')
            confirm.cancel ('Cancel');
            $mdDialog.show (confirm).then (function () {

                api.Club.removeClub (club, function ( err, data ) {


                    if ( data ) {
                        toastr.success (data.message, "Successfully Removed");
                        console.log (data);
                    } else {
                        toastr.error (err.message, "error Removed");
                    }


                })

            }, function () {


            });
        };

        $scope.cancelCreate = function () {
            $state.go ("home.clublist");
        }

        $scope.save = function ( club ) {
            $scope.club.logo = "logo";
            $scope.club.createdBy = "admin";
            $scope.club.netAmount = "0";
            $scope.club.currencyDetails = club.currencyDetails.currency.code;

            console.log ("Club Details :", JSON.stringify (club));

            api.Club.createClub (club, function ( err, data ) {


                if ( data ) {
                    toastr.success (data.message, "Successfully Created");
                    $state.go ("home.clublist");

                } else {
                    console.log (JSON.stringify (err));
                    toastr.error (err.message, "Error Creating Club");
                }


            })


        }

        $scope.updateClub = function ( club ) {

            delete $scope.club.logo;
            delete $scope.club.createdBy;
            delete $scope.club.netAmount;
            delete $scope.club.currencyDetails;

            console.log ("Club Details :", JSON.stringify (club));

            api.Club.updateClub (club, function ( err, data ) {


                if ( data ) {
                    toastr.success (data.message, 'Success');
                    $state.go ("home.clublist");

                } else {
                    console.log ("Updated :", JSON.stringify (err));
                    toastr.warning (err.errorCode, 'Warning');
                }


            })

        }


        function DialogController ( $scope, $mdDialog ) {
            $scope.hide = function () {
                $mdDialog.hide ();
            };
            $scope.cancel = function () {
                $mdDialog.cancel ();
            };
            $scope.answer = function ( answer ) {
                $mdDialog.hide (answer);
            };
        }


    }])


