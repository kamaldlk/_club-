angular.module ('cms.factories')
    .factory ('currency', ['api', 'toastr', function ( api, toastr ) {
        var currency = {};

        currency.getAll = function () {
            api.Currency.getAll (function ( err, data ) {
                if ( data ) {
                    console.log ("getAll Success :", data);
                } else {
                    console.log ("getAll Error :", err);
                }

            });

        };

        currency.getCurrencyList = function () {

            api.Currency.getDetails (function ( err, data ) {
                if ( data ) {
                    console.log ("getAll Success :", data);
                } else {
                    console.log ("getAll Error :", err);
                }
            });

        };

        return currency;
    }]);