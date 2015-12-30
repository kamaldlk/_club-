/**
 * Created with JetBrains WebStorm.
 * User: Habib
 * Date: 11/12/15
 * Time: 12:56 PM
 * To change this template use File | Settings | File Templates.
 */
angular.module ('cms.controllers')

    .controller ("currencyController", ["$scope", "$mdDialog", "$state", "api", "toastr", function ( $scope, $mdDialog, $state, api, toastr ) {


        $scope.getAllCurrencyList = function () {

            api.Currency.getAll (function ( err, data ) {

                if ( data ) {

                    $scope.currencyData = api.Currency.allCountries;
                    console.log ($scope.currencyData)

                    api.Currency.getDetails (function ( err, data ) {

                        if ( data ) {

                            $scope.currencyArray = api.Currency.currencyArray;
                            console.log ($scope.currencyArray)


                            api.Offer.Get (function ( err, data ) {

                                if ( data ) {

                                    $scope.offer = data;

                                }

                            });

                        }

                    });

                }

            });
        }


        $scope.createCurrency = function ( ev ) {

            $mdDialog.show ({
                controller: DialogController,
                templateUrl: 'templates/dialog/add_currency.html',
                targetEvent: ev,
                clickOutsideToClose: true
            })
                .then (function ( answer ) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
        }


        $scope.updateCurrency = function ( ev, currency ) {
            $mdDialog.show ({
                controller: function ( $scope, api ) {

                    $scope.updateView = true;

                    $scope.currencyData = api.Currency.allCountries;

                    $scope.currencyValue = currency;

                    console.log ("currency", currency);

                    $scope.update = function ( currencyValue ) {

                        $scope.updateCurrency = {};

                        $scope.updateCurrency.fromCode = currencyValue.fromCurrency.code;
                        $scope.updateCurrency.toValue = currencyValue.toCurrency[0].value;
                        console.log ("update :", $scope.updateCurrency);

                        api.Currency.update ($scope.updateCurrency, function ( err, data ) {

                            if ( data ) {

                                api.Currency.getDetails (function ( err, data ) {
                                    if ( data ) {

                                        $scope.currencyArray = api.Currency.currencyArray;
                                        console.log ($scope.currencyArray)
                                        $mdDialog.hide ();

                                    }

                                })

                            }


                        })


                    }


                },
                templateUrl: 'templates/dialog/add_currency.html',
                targetEvent: ev,
                clickOutsideToClose: true

            })
                .then (function ( answer ) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });

        }


        $scope.updateOffer = function ( ev, offer ) {

            var confirm = $mdDialog.confirm ();
            confirm.title ('Would you like to edit Offer')
            confirm.ariaLabel ('Lucky day')
            confirm.targetEvent (ev)
            confirm.ok ('Update!')
            confirm.cancel ('Cancel');
            $mdDialog.show (confirm).then (function () {

                api.Offer.Update (offer, function ( err, data ) {


                    if ( data ) {
                        toastr.success (data.message, "Successfully Updated");
                        console.log (data);
                    } else {
                        toastr.error (err.message, "error Removed");
                    }


                })

            });
        }

        function DialogController ( $scope, $mdDialog, api ) {
            $scope.updateView = false;
            $scope.hide = function () {
                $mdDialog.hide ();
            };
            $scope.cancel = function () {
                $mdDialog.cancel ();
            };
            $scope.answer = function ( answer ) {
                $mdDialog.hide (answer);
            };

            $scope.save = function ( currency ) {
                console.log (currency);

                api.Currency.update (currency, function ( err, data ) {

                    if ( data ) {

                        api.Currency.getDetails (function ( err, data ) {
                            if ( data ) {

                                $scope.currencyArray = api.Currency.currencyArray;
                                console.log ($scope.currencyArray)
                                $mdDialog.hide ();

                            }

                        })

                    }


                })

            }

            $scope.getAllCurrencyList = function () {

                api.Currency.getAll (function ( err, data ) {

                    if ( data ) {

                        $scope.currencyData = api.Currency.allCountries;
                        console.log ($scope.currencyData)

                    }

                });
            };
        }


    }])


