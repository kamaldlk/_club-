/**
 * Created with JetBrains WebStorm.
 * User: Habib
 * Date: 03/10/15
 * Time: 10:54 PM
 * To change this template use File | Settings | File Templates.
 */

angular.module ("cms")

    .config (['$stateProvider', '$urlRouterProvider', "apiProvider", function ( $stateProvider, $urlRouterProvider, apiProvider ) {

        $urlRouterProvider.otherwise ("authentication");

        $stateProvider
            .state ('authentication', {
            url: "/authentication",
            templateUrl: "templates/authentication.html",
            controller: 'masterController'
        })
            .state ('home', {
            url: "/home",
            templateUrl: "templates/admin/main.html",
            controller: 'homeController'
        })

            .state ('home.dashboard', {
            url: "/dashboard",
            templateUrl: "templates/admin/dashboard.html",
            controller: 'dashboardController'
        })
            .state ('home.clublist', {
            url: "/clublist",
            templateUrl: "templates/admin/club-list.html",
            controller: 'clubController'
        })

            .state ('home.clubmanager', {
            url: "/clubmanager",
            templateUrl: "templates/admin/club-manager.html",
            controller: 'managerController'
        })
            .state ('home.createclub', {
            url: "/createclub/:clubId",
            templateUrl: "templates/admin/create_club.html",
            controller: 'clubController'
        })
            .state ('home.currency', {
            url: "/currency",
            templateUrl: "templates/admin/currency.html",
            controller: 'currencyController'
        })
            .state ('manager', {
            url: "/manager",
            templateUrl: "templates/manager/managerMain.html",
            controller: 'masterController'
        })

            .state ('manager.memberlist', {
            url: "/managerlist",
            templateUrl: "templates/manager/memberList.html",
            controller: 'memberController'
        })
            .state ('manager.transection', {
            url: "/managertransection",
            templateUrl: "templates/manager/managerTransection.html",
            controller: 'transactionController'
        })

            .state ('manager.transectionentery', {
            url: "/transectionentery",
            templateUrl: "templates/manager/dialog/transection_entry.html",
            controller: 'transactionController'
        })

            .state ('manager.addmember', {
            url: "/manageraddmember",
            templateUrl: "templates/manager/addMember.html",
            controller: 'memberController'
        })

        apiProvider.setApiUrl ("http://localhost:3002/");


    }])
