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
        $scope.filterOption = ['Today', 'Current Month', 'Last Month'];
        $scope.startDate; // = '2016-01-14';
        $scope.endDate; // = '2016-01-21';

        $scope.loggedDate = function ( date ) {
            if(date)
                return date.substring (0, 10);
        }

        $scope.format = function (dateString1, dateString2) {
            console.log('dateString1 ', dateString1);
            console.log('dateString2 ', dateString2);
            var date1 = dateString1.getDate();
            var month1 = dateString1.getMonth() + 1; 
            var year1 = dateString1.getFullYear();

            if(date1 < 10) 
                date1 = '0' + date1;

            if(month1 < 10) 
                month1 = '0' + month1;
            
            $scope.startDate = year1 + '-' + month1 + '-' + date1;
    
            var date2 = dateString2.getDate();
            var month2 = dateString2.getMonth() + 1; 
            var year2 = dateString2.getFullYear();

            if(date2 < 10) 
                date2 = '0' + date2;

            if(month2 < 10) 
                month2 = '0' + month2;
            
            $scope.endDate = year2 + '-' + month2 + '-' + date2;
            

            console.log($scope.startDate, $scope.endDate);
        }

        $scope.filter = function (index) { 
            var now = new Date();
            if(index == 0) 
                $scope.format(now, now);

            else if (index == 1) 
                $scope.format(new Date(now.getFullYear(), now.getMonth(), 1), new Date(now.getFullYear(), now.getMonth() + 1, 0));
            
            else if (index == 2) {
                if (now.getMonth() == 0) 
                    $scope.format(new Date(now.getFullYear() - 1, 11, 1), new Date(now.getFullYear() - 1, 12, 0));
                else 
                    $scope.format(new Date(now.getFullYear(), now.getMonth() - 1, 1), new Date(now.getFullYear(), now.getMonth(), 0));
            }
            console.log('startDate ', $scope.startDate, 'endDate ', $scope.endDate);
        }

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


        $scope.cancelTransaction = function () {
            $state.go ('manager.transection');
        };

        $scope.printGrid = function(divName) {
              var printContents = document.getElementById(divName).innerHTML;
              var popupWin = window.open('', '_blank', 'width=300,height=300');
              popupWin.document.open()
              popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="css/app.css" /><link rel="stylesheet" type="text/css" href="css/common.css" /><link rel="stylesheet" type="text/css" href="css/manager.css" /></head><body onload="window.print()">' + printContents + '</html>');
              popupWin.document.close();

          }

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
