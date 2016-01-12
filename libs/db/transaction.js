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
                var clubRevenue;
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
                            holderUse: 0,
                            holderReference: 0,
                            customer: 0
                        }
                        toUSD(offer);
                    }
                    else if(offer) {                        
                        var holderUse = offer.holderUse.pop();
                        var holderReference = offer.holderReference.pop();
                        var customer = offer.customer.pop();
                        offer = {
                            holderUse: holderUse.percentage,
                            holderReference: holderReference.percentage,
                            customer: customer.percentage
                        }                
                        toUSD(offer);
                    }
                });
                function toUSD (offer) {                                      
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
                            var off;
                            if(data.usedByCardholder) {
                                off = offer.holderUse; 
                                data.amount.saved = (parseInt(data.amount.spent) * (parseInt(off) / 100) * currency).toFixed(3);                   
                                data.amount.offer = off;
                                var addToNetAmount = parseInt(data.amount.saved);
                                clubRevenue = parseInt(data.amount.spent - data.amount.saved);
                                create(addToNetAmount, clubRevenue);
                            }
                            else {                                
                                data.reference.offer = offer.customer;
                                data.reference.offerAmount = (parseInt(data.amount.spent) * (parseInt(offer.customer) / 100) * currency).toFixed(3);

                                data.amount.offer = offer.holderReference;
                                data.amount.saved = (parseInt(data.amount.spent) * (parseInt(offer.holderReference) / 100) * currency).toFixed(3);
                                clubRevenue = parseInt(data.amount.spent) - parseInt(data.amount.saved + data.reference.offerAmount);
                                var addToNetAmount = parseInt(data.amount.saved);
                                create(addToNetAmount, clubRevenue);
                            }
                        }
                    });
                }
                function create (addToNetAmount, clubRevenue) {                     
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
                                db.club.update({'_id': data.clubId}, {$inc: {'netAmount': clubRevenue}, $push: {'revenue': {'transaction': updated._id, 'amount': clubRevenue}}}, function (err, clubUpdate) {
                                    if(err) {
                                       callback({
                                            error: true,
                                            errorCode: 'UNKNOWN_ERROR',
                                            stack: err
                                        }); 
                                    }
                                    else {                                        
                                        console.log(updated);
                                        console.log('club ', clubUpdate);
                                        callback(transaction);
                                    }    
                                });
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
                        callback(result.reverse());
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