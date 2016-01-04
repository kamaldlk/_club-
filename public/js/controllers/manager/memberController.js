/**
 * Created with JetBrains WebStorm.
 * User: Habib
 * Date: 11/12/15
 * Time: 12:34 PM
 * To change this template use File | Settings | File Templates.
 */
angular.module ('cms.controllers')

    .controller ("memberController", ["$scope", "$state", "api", "toastr", "$localStorage", function ( $scope, $state, api, toastr, $localStorage ) {

        $scope.memberDetail = {};

        $scope.$storage = $localStorage;

        $scope.member2 = function ( member ) {

            $scope.memberDetail = member;
        }

        $scope.createMember = function ( member ) {

            //console.log($scope.$storage.adminUsers.club);

            $scope.member.club = "568a3f991239ce5c6de272c3";
            $scope.member.createdBy = $scope.$storage.adminUsers.club.managers[0];

            api.Member.Register (member, function ( err, data ) {

                if ( data ) {
                    toastr.success (data.message, "Successfully Added");
                    console.log (data);
                    $state.go("manager.memberlist");
                } else {
                    toastr.error (err.message, "error Removed");
                }
            })
        }

        $scope.cancel = function(){
            $state.go("manager.memberlist");
        }

        $scope.getAllMember = function () {

            api.Member.getAll (function ( err, data ) {

                if ( data ) {
                    $scope.memberList = api.Member.allMember;
                    $scope.memberLength = api.Member.allMember.length;
                    console.log ("$scope.$storage.adminUsers :", JSON.stringify ($scope.$storage.adminUsers));


                } else {
                   console.log("getAllMember error")
                }
            })
        }

        $scope.getAllMember ();


    }])
;
