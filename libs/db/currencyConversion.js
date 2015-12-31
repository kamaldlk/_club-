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
                db.currencyConversion.findOneAndUpdate({'fromCurrency.code': data.fromCode}, {$push: {'toCurrency': {'value': data.toValue}}, $set: {'updatedOn': Date.now()}}, {new: true}, function (err, updated) {
        			if(err) {
                        callback({
                            error: true,
                            errorCode: 'UNKNOWN_ERROR',
                            stack: err
                        });
                    }
                    else {
                        updated.toCurrency = updated.toCurrency.pop();
                        callback(updated);
                    }
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
                _.each(currency, function(curr) {
                    curr.toCurrency = curr.toCurrency.pop();
                });
                db.currency.find({}, 'currency -_id', function (err, masterCurrency) {
                    var list = (_.pluck(masterCurrency, 'currency'));
                    _.each(currency, function (curr) {
                        _.extend((curr.fromCurrency).toObject(), _.findWhere(list, {'code': curr.fromCurrency.code}));
                        _.extend((curr.toCurrency[0]).toObject(), _.findWhere(list, {'code': currency[0].toCurrency[0].code}));
                    });
                    callback(currency);
                });
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
    },

    // remove currency rate
    remove: function (data, callback) {
        db.currencyConversion.remove({'fromCurrency.code': data.code}, function (err, removed) {
            if(err) {
                callback({
                    error: true,
                    errorCode: 'UNKNOWN_ERROR',
                    stack: err
                });
            }
            else if(!removed) {
                callback({
                    error: true,
                    errorCode: 'Not deleted'
                });
            }
            else if(removed) {
                callback({
                    success: true,
                    message: 'Deleted'
                });
            }
        });
    }
};