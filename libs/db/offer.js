var db = require("./schema/index.js");
var _constants = require("../constants/constants.js");
var uuid = require('node-uuid');
var _ = require("underscore")._;

module.exports = {
	// update the offer rate
    update: function(data, callback) {
        db.offer.findOne({}, function (err, offer) {
            if(err) {
                callback({
                    error: true,
                    errorCode: 'UNKNOWN_ERROR',
                    stack: err
                });
            }
            else if(!offer) {
                console.log('offer ', data);
                var newoffer = {
                    newCustomer: {
                        percentage: data.newCustomer
                    },
                    referralCustomer: {
                        percentage: data.referralCustomer
                    }
                }
                console.log(newoffer);
                var createOffer = new db.offer(newoffer);
                createOffer.save(function () {
                    callback({
                        success: true,
                        message: 'Created'
                    });
                });
            }
            else {
                db.offer.update({}, {$push: {'newCustomer': {'percentage': data.newCustomer}, 'referralCustomer': {'percentage': data.referralCustomer}}}, function (err, updated) {
                    callback({
                        success: true,
                        message: 'Updated'
                    });
                });
            }
        });
    },

    // get latest offer rate
    get: function (data, callback) {
        db.offer.findOne({}, function (err, offer) {
            if(err) {
                callback({
                    error: true,
                    errorCode: 'UNKNOWN_ERROR',
                    stack: err
                });
            }
            else if(!offer || offer.length < 1) {
                callback({
                    error: true,
                    errorCode: 'No offer'
                });
            }
            else {
                var newCustomer = offer.newCustomer.pop();
                var referralCustomer = offer.referralCustomer.pop();
                offer = {
                    newCustomer: newCustomer.percentage,
                    referralCustomer: referralCustomer.percentage
                }
                callback(offer);
            }
        });
    },

    // history of offer rate
    history: function (data, callback) {
        db.offer.find({}, function (err, offer) {
            if(err) {
                callback({
                    error: true,
                    errorCode: 'UNKNOWN_ERROR',
                    stack: err
                });
            }
            else if(!offer || offer.length < 1) {
                callback({
                    error: true,
                    errorCode: 'No offer'
                });
            }
            else {
                callback(offer);
            }
        });
    }
};