angular.module('cms.directives').directive('mainNav', [
        '$rootScope', '$document', '$state', '$mdSidenav','$log', '$window',
        function($rootScope, $document, $state, $mdSidenav, $log, $window ) {

            return {
                // scope: false,
                restrict: 'E',
                templateUrl: './templates/admin/nav-main.html',
                replace: true,
                link: function($scope, iElm, iAttrs, controller) {
                	 $scope.sidebarHidden = false;
                	 /*$scope.toggleSidenav = buildToggler('left');*/
                	 /*
                	  function buildToggler(navID) {
                	      var debounceFn =  $mdUtil.debounce(function(){
                	            $mdSidenav(navID).toggle().then(function () {
                	                $log.debug("toggle " + navID + " is done");
                	              });
                	          },200);
                	      return debounceFn;
                	    };*/
                	$scope.dumpSidebar = function(){
                	  	$scope.sidebarHidden = !$scope.sidebarHidden;
                	}
                    
                    $scope.$watch(
                                function () {
                                    return $window.innerWidth 
                                }, function(newVal, oldVal){
                                    if(newVal < 1000){
                                        $scope.sidebarHidden = true;
                                    }
                                }
                    );
                    
 	        	   $scope.logout = function() {
                        console.log("Logged out");
                       $state.go("authentication");
                   };
                }

            };
        }
    ]);
