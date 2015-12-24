var db = require("../../libs/db/index.js");

module.exports = function(router) {
	// get currency detail of the particular country
	router.get('/getCurrency', function (req, res) {
		var data = {
			currency: req.query.currency
		}
		db.currency.get(data, function (data) {
			res.json(data);
		});
	});

	// get all currency
	router.get('/getAllCurrency', function (req, res) {
		var data = {};
		db.currency.getAll(data, function (data) {
			res.json(data);
		});
	});
}