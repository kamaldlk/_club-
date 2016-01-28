/**
 * Created with JetBrains WebStorm.
 * User: Habib
 * Date: 11/12/15
 * Time: 12:34 PM
 * To change this template use File | Settings | File Templates.
 */
angular.module ('cms.controllers')
    .controller ("dashboardController", ["$scope", "$state", "api", "toastr", "$localStorage", function ( $scope, $state, api, toastr, $localStorage ) {
        $scope.api = api;

        $scope.$storage = $localStorage;

        $scope.dashboardInit = function () {

            api.Club.getAllClub (function ( err, data ) {
                if ( data !== null ) {
                    api.Manager.getAllManager (function ( err, data ) {
                        if ( data !== null ) {
                            api.Member.getAll (function ( err, data ) {
                                if ( data !== null ) {

                                } else {
                                }

                            });
                        } else {
                        }

                    });
                } else {
                }

            });
        }

        $scope.filterOption = ['Today', 'Month', 'Year'];
        $scope.startDate; 
        $scope.endDate; 

        $scope.format = function (type, dateString1, dateString2) {            
            var date1 = dateString1.getDate();
            var month1 = dateString1.getMonth() + 1; 
            var year1 = dateString1.getFullYear();

            if(date1 < 10) 
                date1 = '0' + date1;

            if(month1 < 10) 
                month1 = '0' + month1;
            
            $scope.startDate = year1 + '-' + month1 + '-' + date1;
    
            var date2 = dateString2.getDate();
            var month2 = dateString2.getMonth() + 1; 
            var year2 = dateString2.getFullYear();

            if(date2 < 10) 
                date2 = '0' + date2;

            if(month2 < 10) 
                month2 = '0' + month2;

            $scope.type = type.toLowerCase();
            $scope.endDate = year2 + '-' + month2 + '-' + date2;   
            $scope.getRevenue();
        }

        $scope.filter = function (index) { 
            $scope.startDate;
            $scope.endDate;
            $scope.type = ($scope.filterOption[index]).toLowerCase();
            $scope.getRevenue();
        }

        $scope.getRevenue = function() {
            api.admin.revenue($scope.type, $scope.startDate, $scope.endDate, function (err, data) {
                if(err) {
                    console.log(err);
                    toastr.error (err.errorCode, "error");
                }
                else if(data.success ) {
                    var div = document.getElementById('chart');
                    div.innerHTML = data.message;
                }
                else if(data) {
                    $scope.type;
                    var format;
                    if($scope.type === 'year')
                        format = '%Y';
                    else if($scope.type === 'month')
                        format = '%Y-%m';
                    else
                        format = '%Y-%m-%d';
                    var charData = {
                        bindto: '#chart',
                        data: {
                            x : 'x',
                            columns: [],
                            groups: [data.group],
                            type: 'line'
                        },
                        axis: {
                            x: {
                                type: 'timeseries',
                                tick: {
                                    format: format
                                }
                            }
                        }  
                    }
                    _.each(data.column, function (column) {
                        charData.data.columns.push(column);
                    });
                    $scope.chart = c3.generate(charData);
                }                
            });
        }

    }]);
