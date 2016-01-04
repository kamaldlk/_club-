angular.module('cms.directives').directive('sideNav', [
        '$rootScope', '$mdSidenav',
        function($rootScope, $mdSidenav ) {
            return {
                // scope: false,
                restrict: 'E',
                templateUrl: './templates/admin/side-nav.html',
                replace: true,
                link: function($scope, iElm, iAttrs, controller) {
	        	  
                	/*$scope.toggleSidenav = function(menuId) {
                		$mdSidenav(menuId).toggle();
                	};*/
                    $scope.tabChoosen = function (key){
                        $scope.currentOption = key; 
                    }
                }
            };
        }
    ]);
