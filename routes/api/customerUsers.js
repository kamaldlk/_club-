var db = require("../../libs/db/index.js");
var _ = require("underscore")._;
var uuid = require('node-uuid');
var _constants = require("../../libs/constants/constants.js");

module.exports = function(router) {
    // register the user
    router.post('/customerUsers/register', function (req, res) {
    	var data = {    		
		    profile: req.body.profile,
    		mobileNo: req.body.mobileNo,
		    email: req.body.email,
		    cardNo: req.body.cardNo,
		    address: req.body.address,
		    createdBy: req.body.createdBy, // username of manager
		    club: req.body.club // name of the club
    	}
    	if(req.body.netAmount)
		    data.netAmount = req.body.netAmount;
		db.customerUsers.register(data, function (data) {
			res.send(data);
		});
    });

    // get details of the customer
    router.get('/customerUsers/get', function (req, res) {
    	var data = {
    		email: req.query.email
    	}
    	db.customerUsers.get(data, function (data) {
    		res.send(data);
    	});
    });
};