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

        $scope.getRevenue = function() {
            $scope.type = 'date';
            $scope.startDate = '2016-1-12' 
            $scope.endDate = '2016-1-18'
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
