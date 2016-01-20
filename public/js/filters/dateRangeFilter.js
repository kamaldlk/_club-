angular.module ('cms.filters')
    .filter('dateRange', function() {
	return function(input, startDate, endDate) {

		var retArray = [];

		angular.forEach(input, function(obj){

          if(obj.transactionDate)
              var date = obj.transactionDate.substring (0, 10);

			var receivedDate = date;

			if(receivedDate >= startDate && receivedDate <= endDate) {
				retArray.push(obj);
			}
		});

		return retArray;
	};
});
