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
            $scope.offerDetails = api.Offer.offers.holderUse;
        }

        $scope.switch = function ( switchValue ) {
            console.log('offerDetails ', api.Offer.offers);
            if ( switchValue == true ) {
                $scope.cardHolder = "Card Holder";
                $scope.offerDetails = api.Offer.offers.holderUse;
                $scope.cardHolderValue = switchValue;
            } else {
                $scope.cardHolder = "Referee";
                $scope.offerDetails = api.Offer.offers.holderReference;
                $scope.cardHolderValue = switchValue;
            }
        }

        $scope.calculate = function ( totalValue ) {
            $scope.result = parseInt(totalValue) * parseInt($scope.offerDetails) / 100;
            console.log('result ', $scope.result, totalValue, $scope.offerDetails);
            $scope.totalAmount = totalValue - $scope.result;
        }

        $scope.addTransaction = function () {
            $state.go ('manager.transectionentery');
        }

        $scope.createTransaction = function ( transaction ) {
            $scope.transaction.clubId = $scope.$storage.adminUsers.club._id;
            $scope.transaction.code = $scope.$storage.adminUsers.club.currencyDetails.currency.code;
            $scope.transaction.currency = $scope.$storage.adminUsers.club.currencyDetails._id;
            $scope.transaction.usedByCardholder = $scope.cardHolderValue;
            $scope.transaction.createdBy = $scope.$storage.adminUsers.club.managers[0];
            if ( $scope.cardHolderValue == false ) {
                $scope.transaction.referredBy = $scope.memberDetail._id;
                $scope.transaction.customerDetails = $scope.referedData;
                console.log ($scope.transaction);
            }
            api.Member.CreateTransaction (transaction, function ( err, data ) {
                if ( data ) {
                    toastr.success (data.message, "Successfully Added");
                    $state.go ('manager.transection');
                    console.log (data);
                } else {
                    toastr.error (err.message, "error Removed");
                }
            })
        }

        $scope.loggedDate = function ( date ) {
            if(date)
                return date.substring (0, 10);
        }

        $scope.cancelTransaction = function () {
            $state.go ('manager.transection');
        };

        api.Offer.Get (function ( err, data ) {})
        api.Member.getAll (function ( err, data ) {})
        api.Member.GetClubTransaction ($scope.$storage.adminUsers.club._id, function ( err, data ) {
            if ( data ) {
                $scope.transactionHistory = data;
                console.log (data);
            } else {
                console.log ("GetAllTransaction Error")
            }
        })
    }]);