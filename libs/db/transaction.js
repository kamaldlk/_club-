var db = require("./schema/index.js");
var uuid = require('node-uuid');
var _ = require("underscore")._;

module.exports = {
    // create transaction
    create: function (data, callback) { 
        db.customerUsers.findOne({'cardNo': data.cardNo}, function (err, exists) {
            if(err) {
                callback({
                    error: true,
                    errorCode: 'UNKNOWN_ERROR',
                    stack: err
                });
            }
            else if(!exists) {
                callback({
                    error: true,
                    errorCode: 'Invalid card'
                });
            }
            else if(exists) {                
                db.offer.findOne({}, function (err, offer) {
                    if(err) {
                        callback({
                            error: true,
                            errorCode: 'UNKNOWN_ERROR',
                            stack: err
                        });
                    }
                    else if(!offer) {
                        offer = {
                            newCustomer: 0,
                            referralCustomer: 0
                        }
                        toUSD(offer);
                    }
                    else if(offer) {
                        var newCustomer = offer.newCustomer.pop();
                        var referralCustomer = offer.referralCustomer.pop();
                        offer = {
                            newCustomer: newCustomer.percentage,
                            referralCustomer: referralCustomer.percentage
                        }                
                        toUSD(offer);
                    }
                });
                function toUSD (offer) {
                    var off;
                    if(data.usedByCardholder) 
                        off = offer.newCustomer;
                    else
                        off = offer.referralCustomer;
                    data.amount.offer = off;                    
                    db.currencyConversion.findOne({'fromCurrency.code': data.currencyCode}, 'toCurrency', function (err, currency) {
                        delete data.currencyCode;
                        currency = currency.toCurrency.pop();
                        data.amount.saved = (parseInt(data.amount.spent) * (parseInt(off) / 100) * currency.value).toFixed(3);
                        if(!data.usedByCardholder) {
                            data.reference.offer = off;
                            data.reference.offerAmount = data.amount.saved;
                            create();
                        }
                        else
                            create();
                    });
                }
                function create ()  {  
                    var addToNetAmount;
                    if(data.usedByCardholder)
                        addToNetAmount = data.amount.saved;
                    else 
                        addToNetAmount = data.reference.offerAmount;
                    var transctn = new db.transaction(data);
                    transctn.save(function(err, transaction) {
                        db.customerUsers.update({'cardNo': data.cardNo}, {$inc: {'netAmount': addToNetAmount}}, function (err, updated) {
                            if(err) {
                               callback({
                                    error: true,
                                    errorCode: 'UNKNOWN_ERROR',
                                    stack: err
                                }); 
                            }
                            else {
                                callback(transaction);
                            }
                        });
                    });
                }
            }
        });
    }
};