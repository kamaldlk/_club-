/**
 * Created with JetBrains WebStorm.
 * User: Habib
 * Date: 11/12/15
 * Time: 12:34 PM
 * To change this template use File | Settings | File Templates.
 */
angular.module ('cms.controllers')

    .controller ("transactionController", ["$scope", "$state", "api", "toastr", "$localStorage", "$mdDialog", function ( $scope, $state, api, toastr, $localStorage, $mdDialog ) {

        $scope.cardHolder = "Card Holder";

        $scope.cardHolderValue = true;

        $scope.searchUser = function ( cardNoValue ) {

            $scope.memberDetail = _.findWhere (api.Member.allMember, {cardNo: cardNoValue});
            console.log ("$scope.memberDetail :", $scope.memberDetail);


            $scope.offerDetails = api.Offer.offers.newCustomer;

        }

        $scope.switch = function ( switchValue ) {

            if ( switchValue == true ) {
                $scope.cardHolder = "Card Holder";
                $scope.offerDetails = api.Offer.offers.newCustomer;
                $scope.cardHolderValue = switchValue;
            } else {
                $scope.cardHolder = "Referee";
                $scope.offerDetails = api.Offer.offers.referralCustomer;
                $scope.cardHolderValue = switchValue;
            }

        }

        $scope.calculate = function ( totalValue ) {

            $scope.result = parseInt (totalValue) * parseInt ($scope.offerDetails) / 100;


        }


        api.Offer.Get (function ( err, data ) {})
        api.Member.getAll (function ( err, data ) {})

        $scope.addTransaction = function ( ev ) {

            $mdDialog.show ({
                controller: DialogController,
                templateUrl: 'templates/manager/dialog/transection_entry.html',
                targetEvent: ev,
                clickOutsideToClose: true

            })
                .then (function ( answer ) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
        }


        $scope.createTransaction = function ( transaction ) {

            $scope.transaction.clubId = "568a3f991239ce5c6de272c3";
            $scope.transaction.code = "INR";
            $scope.transaction.currency = $scope.$storage.adminUsers.club.currencyDetails;
            $scope.transaction.usedByCardholder = $scope.cardHolderValue;
            $scope.transaction.createdBy = $scope.$storage.adminUsers.club.managers[0];

            if ( $scope.cardHolderValue == false ) {
                $scope.transaction.referredBy = $scope.memberDetail._id;
                $scope.transaction.customerDetails = $scope.referedData;
                console.log ($scope.transaction)
            }


            api.Member.CreateTransection (transaction, function ( err, data ) {

                if ( data ) {
                    toastr.success (data.message, "Successfully Added");
                    console.log (data);
                } else {
                    toastr.error (err.message, "error Removed");
                }

            })


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

        }
    }]);
