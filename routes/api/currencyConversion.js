var db = require("../../libs/db/index.js");
var _ = require("underscore")._;
var uuid = require('node-uuid');
var _constants = require("../../libs/constants/constants.js");

module.exports = function(router) {
    // update currency rate
    router.post('/currencyConversion/update', function (req, res) {
    	var data = {
    		fromCode: req.body.fromCode,
    		toValue: req.body.toValue
    	}
    	db.currencyConversion.update(data, function (data) {
    		res.json(data);
    	});
    });

    // get currency rate
    router.get('/currencyConversion/get', function (req, res) {
    	var data = {};
    	db.currencyConversion.get(data, function (data) {
    		res.send(data);
    	});
    });

    // get history of currency rate
    router.get('/currencyConversion/history', function (req, res) {
    	var data = {};
    	db.currencyConversion.history(data, function (data) {
    		res.send(data);
    	});
    });

    // remove currency rate
    router.delete('/currencyConversion/remove', function (req, res) {
        var data = {
            code: req.query.code
        }
        db.currencyConversion.remove(data, function (data) {
            res.json(data);
        });
    });
};