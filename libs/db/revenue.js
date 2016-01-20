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
		else if(data.type === 'date' || data.type === 'today') {
			date = {
				day: {$dayOfMonth: "$transactionDate"},
				month: {$month: "$transactionDate"}, 
				year: {$year: "$transactionDate"}
			}
		}
		var matchString = [{
			$group: {
				_id: {club: '$clubId', date : date},
				revenue: {$sum: '$clubRevenue'}
			}			
		}];
		if(data.type === 'today' || (data.startDate && data.endDate)) {
			var match = {
				$match: {
					transactionDate: {$gte: data.startDate, $lte: data.endDate}
				}
			}
			matchString.unshift(match);
		}
		// console.log('string ', JSON.stringify(matchString));
		db.transaction.aggregate(matchString, function (err, transactions) {
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
				var convertMonth = function (number) {
					var month = new Array();
					month[1] = "January";
					month[2] = "February";
					month[3] = "March";
					month[4] = "April";
					month[5] = "May";
					month[6] = "June";
					month[7] = "July";
					month[8] = "August";
					month[9] = "September";
					month[10] = "October";
					month[11] = "November";
					month[12] = "December";
					return month[number];
				}				
				db.club.populate(transactions, {path: '_id.club', select: '-_id clubName'}, function (err, club) {
					if(data.type === 'month') {
						var result = [];
						_.each(transactions, function (transaction) {
							var data = {
								clubName: transaction._id.club.clubName,	
								date: transaction._id.date.year + '-' + (transaction._id.date.month) + '-1',
								revenue: transaction.revenue
							}
							result.push(data);
						});
						chartData(result.reverse());
					}
					else if(data.type === 'year') {
						var result = [];
						_.each(transactions, function (transaction) {
							var data = {
								clubName: transaction._id.club.clubName,	
								date: transaction._id.date.year + '-1-1' ,
								revenue: transaction.revenue
							}
							result.push(data);
						});
						chartData(result.reverse());
					}
					else if(data.type === 'date' || data.type === 'today') {
						var result = [];
						_.each(transactions, function (transaction) {
							var data = {
								clubName: transaction._id.club.clubName,	
								date: transaction._id.date.year + '-' + (transaction._id.date.month) + '-' + transaction._id.date.day,
								revenue: transaction.revenue
							}
							result.push(data);
						});
						chartData(result.reverse());
					}
					function chartData (result) {
						var column = [];
	                    var date = [], clubs = [];
	                    var clubNames = [];
	                    _.each(result, function (rev) {
                        	date.push(rev.date);
                        	clubNames.push(rev.clubName);
                        	var data = _.findWhere(clubs, {'name': rev.clubName});
                        	if(!data) {
                        		clubs.push({'name': rev.clubName, 'values': [rev.revenue], 'date': [rev.date]})
                        	}
                        	else if(data) {
                        		data.values.push(rev.revenue);
                        		data.date.push(rev.date);
                        	}
	                    });
	                    date = _.uniq(date);
	                    var clubCount = clubs.length;
                    	var revenue = [];
	                    recursive(0);
	                    function recursive(i) {
                    		var ctClub = clubs[i];                    		
	                    	if(i >= clubCount) {
	                    		date.unshift('x');		
	                    		column.push(revenue);
	                    		column.unshift(date);
	                    		// console.log('column ', column);
	                    		var data = {
	                    			group: _.uniq(clubNames),
	                    			column: column
	                    		}
								callback(data);
	                    	}
	                    	else {
	                    		if(revenue.length > 0) {	                    			
	                    			column.push(revenue);
	                    			revenue = new Array();
	                    		}
			                    _.each(date, function (ctDate) {
			                    	var idx = ctClub.date.indexOf(ctDate);
			                    	if(idx >= 0) {
			                    		revenue.push(ctClub.values[idx]);
			                    	}
			                    	else
			                    		revenue.push(0);
		                    	});
		                    	revenue.unshift(ctClub.name);
		                    	recursive(i + 1);
	                    	}
	                    }
					}
				});
			}
		});
	}
}