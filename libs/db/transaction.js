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
                        if(err) {
                            callback({
                                error: true,
                                errorCode: 'UNKNOWN_ERROR',
                                stack: err
                            });
                        }
                        else {
                            delete data.currencyCode;
                            if(currency) {
                                var currencyObject = currency.toCurrency.pop();
                                currency = currencyObject.value;
                            }
                            else if(!currency)
                                currency = parseInt(1);
                            data.amount.saved = (parseInt(data.amount.spent) * (parseInt(off) / 100) * currency).toFixed(3);
                            if(!data.usedByCardholder) {
                                data.reference.offer = off;
                                data.reference.offerAmount = data.amount.saved;
                                create();
                            }
                            else
                                create();
                        }
                    });
                }
                function create () {  
                    var addToNetAmount;
                    if(data.usedByCardholder)
                        addToNetAmount = parseInt(data.amount.saved);
                    else 
                        addToNetAmount = parseInt(data.reference.offerAmount);
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
                                console.log(updated);
                                callback(transaction);
                            }
                        });
                    });
                }
            }
        });
    },

    // get all the transaction details
    getAll: function (data, callback) {
        db.transaction.find({}).populate([{path: 'clubId', select: '-status -createdOn -managers'}, {path: 'currency', select: '-status -createdOn'}]).exec(function (err, transactions) {
            if(err) {
                callback({
                    error: true,
                    errorCode: 'UNKNOWN_ERROR',
                    stack: err
                });
            }
            else if(!transactions || transactions.length < 1) {
                callback({
                    error: true,
                    errorCode: 'No transactions'
                });
            }
            else {
                var result = [];
                ownerInfo(0);
                function ownerInfo(i) {
                    if(i >= transactions.length) 
                        callback(result);
                    else {
                        var transaction = transactions[i].toObject();
                        db.customerUsers.findOne({'cardNo': transaction.cardNo}, 'profile mobileNo email', function (err, customer) {
                            transaction.cardOwner = customer;
                            result.push(transaction);
                            ownerInfo(i + 1);
                        });
                    }
                }
            }
        });
    },

    // get all the transaction in the single club
    getClub: function (data, callback) {
        db.transaction.find({'clubId': data.clubId}).populate([{path: 'clubId', select: '-status -createdOn -managers'}, {path: 'currency', select: '-status -createdOn'}]).exec(function (err, transactions) {
            if(err) {
                callback({
                    error: true,
                    errorCode: 'UNKNOWN_ERROR',
                    stack: err
                });
            }
            else if(!transactions || transactions.length < 1) {
                callback({
                    error: true,
                    errorCode: 'No transactions'
                });
            }
            else {
                var result = [];
                ownerInfo(0);
                function ownerInfo(i) {
                    if(i >= transactions.length) 
                        callback(result);
                    else {
                        var transaction = transactions[i].toObject();
                        db.customerUsers.findOne({'cardNo': transaction.cardNo}, 'profile mobileNo email', function (err, customer) {
                            transaction.cardOwner = customer;
                            result.push(transaction);
                            ownerInfo(i + 1);
                        });
                    }
                }
            }
        });
    }
};