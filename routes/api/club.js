var db = require("../../libs/db/index.js");

module.exports = function (router) {
	// create new club
	router.post('/createClub', function (req, res) {
		var data = {
			clubName: req.body.clubName,
		    netAmount: req.body.netAmount,
		    currencyDetails: req.body.currency,
		    address: req.body.address,
		    createdBy: req.body.createdBy,
		}
		db.club.register(data, function (data) {
			res.send(data);
		})
	});

	//get club detail
	router.get('/getClub', function (req, res) {
		var data = {
			clubName: req.query.name
		}
		db.club.get(data, function (data) {
			res.send(data);
		});
	});
}