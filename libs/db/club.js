var db = require("./schema/index.js");
var _constants = require("../constants/constants.js");
var uuid = require('node-uuid');
var _ = require("underscore")._;

module.exports = {

    register: function(data, callback) {
    	db.club.findOne({'clubName': data.clubName}, function (err, club) {
    		if(err) {
    			callback({
    				error: true,
    				errorCode: 'UNKNOWN-ERROR',
    				stack: err
    			})
    		}
    		else if(club) {
    			callback({
    				error: true,
    				errorCode: 'Already_Exists'
    			})
    		}
    		else if(!club) {
    			var newClub = new db.club(data);
    			newClub.save(function (err, club) {
    				callback(club);
    			});
    		}
    	});
    },

    get: function(data, callback) {
    	db.club.findOne({'clubName': data.clubName}).populate('currency', '-_id').exec(function (err, club) {
    		if(err) {
    			callback({
    				error: true,
    				errorCode: 'UNKNOWN-ERROR',
    				stack: err
    			})
    		}
    		else if(!club) {
    			callback({
    				error: true,
    				errorCode: 'NOT_EXISTS'
    			})
    		}
    		else if(club) {    			
				callback(club);		
    		}
    	});
    }
};