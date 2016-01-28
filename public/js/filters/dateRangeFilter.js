angular.module ('cms.filters')
    .filter('dateRange',['$rootScope', function($rootScope) {
	return function(input, startDate, endDate) {
		if(startDate && endDate) {
			var retArray = [];

			angular.forEach(input, function(obj){

	          if(obj.transactionDate)
	              var date = obj.transactionDate.substring (0, 10);

				var receivedDate = date;

				if(receivedDate >= startDate && receivedDate <= endDate) {
					retArray.push(obj);
				}
			});
			$rootScope.transactionLength = retArray.length;
			return retArray;
		}
		else {
			$rootScope.transactionLength = input.length;
			return input;
		}
	};
}]);
