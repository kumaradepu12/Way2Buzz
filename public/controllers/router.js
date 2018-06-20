var app = angular.module('appRoutes', ['ngRoute'])
    .config(function($locationProvider,$routeProvider) {

            $routeProvider
                .when('/home', {
                    templateUrl:'views/home.html',
                    authenticated:true
                })
                .when('/employee/',{
                    templateUrl:'views/employeelist.html',
                    authenticated:true
                })
                .when('/companies/',{
                    templateUrl:'views/companylist.html',
                    authenticated:true
                })
                .when('/persons/',{
                    templateUrl:'views/Person-List.html',
                    authenticated:true
                })
                .when('/personscompany/',{
                    templateUrl:'views/Person-CompanyList.html',
                    authenticated:true
                })
                .when('/mycompanieslist/',{
                    templateUrl:'views/myCompanyList.html',
                    authenticated:true
                })
                .when('/mycontactslist/',{
                    templateUrl:'views/myContactsList.html',
                    authenticated:true
                })
                .when('/advcompanies/',{
                    templateUrl:'views/companylist.html',
                    authenticated:true
                })
                .when('/advpeople/',{
                    templateUrl:'views/Person-List.html',
                    authenticated:true

                })
                .when('/linkedin/:token', {
                    templateUrl:'views/sample.html',
                    controller: 'linkedinCtrl',
                    controllerAs: 'linkedin',
                    authenticated:false
                })

                // .when('/linkedinerror',{
                //     // templateUrl:'index.html',
                //     controller: 'linkedinCtrl',
                //     controllerAs: 'linkedin',
                //     authenticated:false
                // })

                .when('/',{
                    templateUrl:'index2.html'
                })

                .otherwise({redirectTo:'/'});

            $locationProvider.html5Mode({ enabled: true, requireBase: false });

        })


app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location){
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (next.$$route !== undefined) {
            if (next.$$route.authenticated === true) {
                if (!Auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/');
                }
            }
        }
    })
}])