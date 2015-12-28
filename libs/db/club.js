var db = require("./schema/index.js");
var _constants = require("../constants/constants.js");
var uuid = require('node-uuid');
var _ = require("underscore")._;

module.exports = {
	// club registration
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
    			db.currency.findOne({'currency.code': data.currencyDetails}, function (err, currency) { 
    				if(err) {
    					callback({
		    				error: true,
		    				errorCode: 'UNKNOWN-ERROR',
		    				stack: err
		    			})
		    		}
		    		else if(!currency) {
		    			callback({
		    				error: true,
		    				errorCode: 'No such currency'
		    			})
		    		}
		    		else if(currency) {		    			
		    			var newClub = new db.club(data);
		    			newClub.currencyDetails = currency._id;
		    			newClub.save(function (err, club) {    
		    				if(err)
		    					console.log('error ', err);
		    				callback(club);				
		    			});
		    		}
    			});
    		}
    	});
    },

    // get single club details
    get: function(data, callback) {
    	db.club.findOne({'clubName': data.clubName}).populate('currencyDetails', '-_id -createdOn').exec(function (err, club) {
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
    },

    // get all club details
    getAll: function (data, callback) {
    	db.club.find({}).populate('currencyDetails', '-_id -createdOn').exec(function (err, club) {
    		if(err) {
    			callback({
    				error: true,
    				errorCode: 'UNKNOWN-ERROR',
    				stack: err
    			})
    		}
    		else if(!club || club.length < 1) {
    			callback({
    				error: true,
    				errorCode: 'NOT_EXISTS'
    			})
    		}
    		else {    			
				callback(club);		
    		}
    	});
    },

    // edit club
    edit: function (data, callback) {
    	db.club.update({'clubName': data.club}, {$set: data}, {new: true}, function (err, updateClub) {
    		if(err) {
    			callback({
    				error: true,
    				errorCode: 'UNKNOWN-ERROR',
    				stack: err
    			})
    		}
    		else if(!updateClub) {
    			callback({
    				error: true,
    				errorCode: 'NOT_UPDATED'
    			})
    		}
    		else if(updateClub) {    			
				callback({
					success: true,
					message: 'UPDATED'
				});		
    		}
    	});
    },

    // remove club
    remove: function (data, callback) {
    	db.club.remove({'clubName': data.clubName}, function (err, deleted) {
    		if(err) {
    			callback({
    				error: true,
    				errorCode: 'UNKNOWN-ERROR',
    				stack: err
    			})
    		}
    		else if(!deleted) {
    			callback({
    				error: true,
    				errorCode: 'NOT_DELETED'
    			})
    		}
    		else if(deleted) {    			
				callback({
					success: true,
					message: 'DELETED'
				});		
    		}
    	});
    }
};