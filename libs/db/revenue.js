var db = require("./schema/index.js");
var _ = require("underscore");

module.exports = {
	// get all revenue
	getAll: function (data, callback) {
		db.club.find(data, 'clubName netAmount logo coverPic', function (err, clubDetails) {
			if(err) {
				callback({
					error: true,
					errorCode: 'UNKNOWN_ERROR',
					stack: err
				});
			}
			else if(!clubDetails || clubDetails.length < 1) {
				callback({
					error: true,
					errorCode: 'No clubs'
				});
			}
			else {				
				_.each(clubDetails, function (club) {
					if(!club.netAmount) {
						club.netAmount = 0;
					}
				});
				callback(clubDetails);
			}
		});
	},

	// get between dates per club
	get: function (data, callback) {
		var date;
		if(data.type === 'month') {
			date = {
				month: {$month: "$transactionDate"},
				year: {$year: "$transactionDate"}
			}
		}
		else if(data.type === 'year') {
			date = {
				year: {$year: "$transactionDate"}
			}
		}
		else if(data.type === 'date') {
			date = {
				day: {$dayOfMonth: "$transactionDate"},
				month: {$month: "$transactionDate"}, 
				year: {$year: "$transactionDate"}
			}
		}

		db.transaction.aggregate([{
			$group: {
				_id: {club: '$clubId', date : date},
				revenue: {$sum: '$clubRevenue'}
			}
		}], function (err, transactions) {
			if(err) {
				callback({
					error: true,
					errorCode: 'UNKNOWN_ERROR',
					stack: err
				});
			}
			else if(!transactions || transactions.length < 1) {
				callback({
					error: true,
					errorCode: 'No transactions'
				});
			}
			else {
				db.club.populate(transactions, {path: '_id.club', select: '-_id clubName'}, function (err, club) {
					callback(transactions);
				});
			}
		});
	}
}