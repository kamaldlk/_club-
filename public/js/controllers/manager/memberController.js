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

        $scope.clubName =    $scope.$storage.adminUsers.club.clubName;

        $scope.member2 = function ( member ) {

            $scope.memberDetail = member;

        }

        $scope.createMember = function ( member ) {

            //console.log($scope.$storage.adminUsers.club);

            $scope.member.club = $scope.$storage.adminUsers.club._id;
            $scope.member.createdBy = $scope.$storage.adminUsers.club.managers[0];

            api.Member.Register (member, function ( err, data ) {

                if ( data ) {
                    toastr.success (data.message, "Successfully Added");
                    console.log (data);
                    $state.go ("manager.memberlist");
                } else {
                    toastr.error (err.message, "error Removed");
                }
            })
        }

        $scope.cancel = function () {
            $state.go ("manager.memberlist");
        }

        $scope.getAllMember = function () {

            api.Member.getAllClubMembers ($scope.$storage.adminUsers.club._id, function ( err, data ) {

                if ( data ) {
                    $scope.memberList = api.Member.allClubMember;
                    $scope.memberLength = api.Member.allClubMember.length;
                    $scope.memberDetail = $scope.memberList[0];

                } else {
                    console.log ("getAllMember error")
                }
            })

        }

        $scope.loggedDate = function ( date ) {
            if(date)
                return date.substring (0, 10);

        }

        $scope.getAllMember ();


    }]);
