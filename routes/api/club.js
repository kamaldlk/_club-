var db = require("../../libs/db/index.js");
var path = require('path');
var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty({ uploadDir : path.join(__dirname, '../../public/images/clubImages/clublogo/')});

module.exports = function (router) {
	// create new club
	router.post('/club/create', function (req, res) {
		if (!req.body.clubName || !req.body.currencyDetails || !req.body.contactNumber) {
			res.send({
				error: true,
				errorCode: 'Missing mandatory fields'
			})
		}
		else {			
			var data = {
				clubName: req.body.clubName,
			    netAmount: req.body.netAmount,
			    currencyDetails: req.body.currencyDetails,
			    address: req.body.address,
			    createdBy: req.body.createdBy,
			    contactNumber: req.body.contactNumber		    		    		    
			}
			if(req.body.logo)
				data.logo = req.body.logo;
			if(req.body.email)
				data.email = req.body.email;
			if(req.body.description)
				data.description = req.body.description;
			if(req.body.coverPic)
				data.coverPic = req.body.coverPic;
			db.club.register(data, function (data) {
				console.log('data ', data);
				res.send(data);
			});
		}
	});

	// get club detail
	router.get('/club/get', function (req, res) {
		var data = {
			clubName: req.query.name
		}
		db.club.get(data, function (data) {
			res.send(data);
		});
	});

	// get all club detail
	router.get('/club/getAll', function (req, res) {
		var data = {};
		db.club.getAll(data, function (data) {
			res.send(data);
		});
	});

	// edit club detail
	router.put('/club/edit', function (req, res) {		
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
	router.delete('/club/delete', function (req, res) {
		var data = {
			club: req.query.clubName
		};
		db.club.remove(data, function (data) {
			res.send(data);
		});
	});

	// to get the file
	router.get('/fileUpload',function(req,res){
	    res.sendFile(__dirname + "/index.html");
	});
	
	// logo upload
	router.post('/club/logo', multipartyMiddleware, function(req,res, next) {
		var path = req.files.file.path;
        var pattern = 'public/'        
        var output = path.substr(path.indexOf(pattern) + pattern.length, path.length);
        res.json ({
            success: true,
            filePath: output,
            message: 'Image uploaded'
        });
	});
}