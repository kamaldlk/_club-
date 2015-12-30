/**
 * Created with JetBrains WebStorm.
 * User: Habib
 * Date: 03/10/15
 * Time: 10:54 PM
 * To change this template use File | Settings | File Templates.
 */

angular.module ("cms")

    .config (['$stateProvider', '$urlRouterProvider',"apiProvider", function ( $stateProvider, $urlRouterProvider,apiProvider ) {

        $urlRouterProvider.otherwise ("/authentication");

        $stateProvider
            .state ('authentication', {
            url: "/authentication",
            templateUrl: "templates/authentication.html",
            controller: 'mainController'
        })
            .state ('home', {
            url: "/home",
            templateUrl: "templates/main.html",
            controller: 'homeController'
        })

            .state ('home.dashboard', {
            url: "/dashboard",
            templateUrl: "templates/dashboard.html",
            controller: 'homeController'
        })
            .state ('home.clublist', {
            url: "/clublist",
            templateUrl: "templates/club-list.html",
            controller: 'clubController'
        })

            .state ('home.clubmanager', {
            url: "/clubmanager",
            templateUrl: "templates/club-manager.html",
            controller: 'managerController'
        })
            .state ('home.createclub', {
            url: "/createclub/:clubId",
            templateUrl: "templates/create_club.html",
            controller: 'clubController'
        })
            .state ('home.currency', {
            url: "/currency",
            templateUrl: "templates/currency.html",
            controller: 'currencyController'
        })


        apiProvider.setApiUrl("http://192.168.1.49:3002/");


    }])
