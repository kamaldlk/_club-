var db = require("../../libs/db/index.js");
var _ = require("underscore")._;
var uuid = require('node-uuid');
var _constants = require("../../libs/constants/constants.js");

module.exports = function(router) {
    // update offer rate
    router.post('/offer/update', function (req, res) {
    	var data = {
    		holderUse: req.body.holderUse,
    		holderReference: req.body.holderReference,
            customer: req.body.customer
    	}
    	db.offer.update(data, function (data) {
    		res.send(data);
    	});
    });

    // get offer rate
    router.get('/offer/get', function (req, res) {
    	var data = {};
    	db.offer.get(data, function (data) {
    		res.send(data);
    	});
    });

    // get history of offer rate
    router.get('/offer/history', function (req, res) {
    	var data = {};
    	db.offer.history(data, function (data) {
    		res.send(data);
    	});
    });
};