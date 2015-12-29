var db = require("./schema/index.js");
var _constants = require("../constants/constants.js");
var uuid = require('node-uuid');
var _ = require("underscore")._;

module.exports = {
	// update the currency rate
    update: function(data, callback) {
    	db.currencyConversion.findOne({'fromCurrency.code': data.fromCode}, function (err, currency) {
    		if(err) {
    			callback({
    				error: true,
    				errorCode: 'UNKNOWN_ERROR',
    				stack: err
    			});
    		}
            else if(!currency) {
                var newCurrency = {
                    fromCurrency: {
                        code: data.fromCode
                    },
                    toCurrency: {
                        value: data.toValue
                    }
                }
                var newcurrency = new db.currencyConversion(newCurrency);
                newcurrency.save(function () {
                    callback({
                        success: true,
                        message: 'Created'
                    });
                });
            }
    		else {
                db.currencyConversion.update({'fromCurrency.code': data.fromCode}, {$push: {'toCurrency': {'value': data.toValue}}, $set: {'updatedOn': Date.now()}}, function (err, updated) {
        			callback({
        				success: true,
        				message: 'Updated'
        			});
                });
    		}
    	});
    },

    // get latest currency rate
    get: function (data, callback) {
    	db.currencyConversion.find({}, function (err, currency) {
    		if(err) {
    			callback({
    				error: true,
    				errorCode: 'UNKNOWN_ERROR',
    				stack: err
    			});
    		}
    		else if(!currency || currency.length < 1) {
    			callback({
    				error: true,
    				errorCode: 'No currency'
    			});
    		}
    		else {
    			console.log('before currency ', currency);
    			_.each(currency, function (curr) {
    				curr.toCurrency = curr.toCurrency.pop();
    			});
    			console.log('after currency ', currency);
    			callback(currency);
    		}
    	});
    },

    // history of currency rate
    history: function (data, callback) {
    	db.currencyConversion.find({}, function (err, currency) {
    		if(err) {
    			callback({
    				error: true,
    				errorCode: 'UNKNOWN_ERROR',
    				stack: err
    			});
    		}
    		else if(!currency || currency.length < 1) {
    			callback({
    				error: true,
    				errorCode: 'No currency'
    			});
    		}
    		else {
    			callback(currency);
    		}
    	});
    }
};