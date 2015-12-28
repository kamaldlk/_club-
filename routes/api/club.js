var db = require("../../libs/db/index.js");

module.exports = function (router) {
	// create new club
	router.post('/createClub', function (req, res) {
		if (!req.body.clubName || !req.body.currencyDetails || !req.body.contactNumber) {
			res.send({
				error: true,
				errorCode: 'Missing mandatory fields'
			})
		}
		else {			
			var data = {
				clubName: req.body.clubName,
			    netAmount: req.body.netAmount + ' USD' ,
			    currencyDetails: req.body.currencyDetails,
			    address: req.body.address,
			    createdBy: req.body.createdBy,
			    contactNumber: req.body.contactNumber		    		    		    
			}
			if(req.body.logo)
				data.logo = req.body.logo;
			if(req.body.email)
				data.email = req.body.email;
			db.club.register(data, function (data) {
				console.log('data ', data);
				res.send(data);
			});
		}
	});

	// get club detail
	router.get('/getClub', function (req, res) {
		var data = {
			clubName: req.query.name
		}
		db.club.get(data, function (data) {
			res.send(data);
		});
	});

	// get all club detail
	router.get('/getAllClub', function (req, res) {
		var data = {};
		db.club.getAll(data, function (data) {
			res.send(data);
		});
	});

	// edit club detail
	router.put('/editClub', function (req, res) {		
		var data = req.body;
		data.club = req.query.clubName;
		if(data.currencyDetails || data.netAmount || data.createdBy) {
			res.send({
				error: true,
				errorCode: 'Cannot change basic details'
			});
		}
		else {
			db.club.edit(data, function (data) {
				res.send(data);
			});
		}		
	});

	// delete club
	router.delete('/deleteClub', function (req, res) {
		var data = {
			club: req.query.clubName
		};
		db.club.remove(data, function (data) {
			res.send(data);
		});
	});
}