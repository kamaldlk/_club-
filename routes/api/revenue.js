var db = require("../../libs/db/index.js");
var _ = require("underscore")._;

module.exports = function (router) {
	// overall revenue
	router.get('/revenue/getAll', function (request, response) {
		var data = {};
		db.revenue.getAll(data, function(data) {
			response.send(data);
		});
	});

	// get per club with date
	router.get('/revenue/club', function (request, response) {
		var data = {
			clubId: request.query.clubId,
			type: request.query.type
		}
		function start (date) {
			var date1 = new Date(date);
			date1.setHours(00);
			date1.setMinutes(00);
			date1.setSeconds(00);
			return date1;
		}

		function end (date) {
			var date2 = new Date(date);
			date2.setHours(23);
			date2.setMinutes(59);
			date2.setSeconds(59);
			return date2;
		}

		if(request.query.type === 'today') {
			data.startDate = start(Date.now())
			data.endDate = end(Date.now());
		}

		console.log('data ', data);
		db.revenue.get(data, function (data) {
			response.send(data);
		});
	});
}