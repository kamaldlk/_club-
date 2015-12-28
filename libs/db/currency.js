var db = require("./schema/index.js");
var _constants = require("../constants/constants.js");
var uuid = require('node-uuid');
var _ = require("underscore")._;

module.exports = {
	// get specific currency
    get: function(data, callback) {
    	db.currency.findOne({'currency.currency': data.currency}, function (err, currency) {
    		if(currency) {
    			callback(currency);
    		}
    	});
    },
    // get all currency
    getAll: function(data, callback) {    	
    	db.currency.find({}, '-_id', function (err, currency) {
    		if(currency) {
    			callback(currency);
    		}
    	});
    }
};