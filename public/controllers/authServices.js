angular.module('authServices',[])

    .factory('CompanyRetriever', function($http, $q, $timeout){

        var CompanyRetrievers = new Object();

        CompanyRetrievers.getCompanies = function(i,type) {

           var companyData = $q.defer();

          //  console.log(moviedata.data)

            var companies=[];

            var someMovies = ["Tech mahindra", "Way2online", "Infosys", "Wipro"];

            var moreMovies = ["Drinking Buddies", "Red 2","Jobs", "Getaway", "Red Obsession", "2 Guns", "The World's End", "Planes", "Paranoia", "The To Do List", "Man of Steel", "The Way Way Back", "Before Midnight", "Only God Forgives", "I Give It a Year", "The Heat", "Pacific Rim", "Pacific Rim", "Kevin Hart: Let Me Explain", "A Hijacking", "Maniac", "After Earth", "The Purge", "Much Ado About Nothing", "Europa Report", "Stuck in Love", "We Steal Secrets: The Story Of Wikileaks", "The Croods", "This Is the End", "The Frozen Ground", "Turbo", "Blackfish", "Frances Ha", "Prince Avalanche", "The Attack", "Grown Ups 2", "White House Down", "Lovelace", "Girl Most Likely", "Parkland", "Passion", "Monsters University", "R.I.P.D.", "Byzantium", "The Conjuring", "The Internship"]

            if(i && i.indexOf('...')!=-1) {

                    // movies=someMovies
                    companies = [];
                companyData.resolve(companies);
            }

            else {

                var data={};
                data.search=i;
                data.index=type;

                $http({

                    url: '/api/suggest_list',
                    method: "POST",
                    data: data

                }).then(function(response) {
                        companies=response.data.list
                        companyData.resolve(companies);
                        },

                        function(error) {

                        console.log(error);

                        });

            }

               // $timeout(function () {
               //
               //
               //
               // },150)

                return companyData.promise

        }
            return CompanyRetrievers;

    })


.factory('Auth',function ($http,AuthToken,$q,AuthInterceptors) {

        var authFactory={};

        authFactory.login=function (logindata) {
            return $http.post('/api/authenticate',logindata).then(function (response) {
                AuthToken.setToken(response.data.token);
                return response
            })
        };

        authFactory.socialMedia=function (data) {

            AuthToken.setToken(data)

        };


        authFactory.isLoggedIn=function () {
            if (AuthToken.getToken())
            {
                return true;
            }
            else {
                return false;
            }

        };

        authFactory.getUser=function () {
            if(AuthToken.getToken()) {
                return $http.post('/api/me');
            }
            else {
                $q.reject({message:"User has no Token"});
            }

        };

        authFactory.logout=function () {
            AuthToken.setToken();
        };

        authFactory.display_company_result=function (cname) {
            return $http.post('/api/display_company_result',cname).then(function (response) {
                return response.data;

            })

        }

        authFactory.display_employee_result=function (cmp) {
            return $http.post('/api/display_employee_result',cmp).then(function (response) {
                return response.data;

            })

        };
    authFactory.display_person_result=function (cmp) {
        return $http.post('/api/display_person_result',cmp).then(function (response) {
            return response.data;

        })

    };

        authFactory.my_companies_save=function (data) {
            return $http.post('/api/my_companies_save',data).then(function (response) {
                return response.data;

            })

        }

        authFactory.my_employee_save=function (data) {
            return $http.post('/api/my_employee_save',data).then(function (response) {
                return response.data;

            })
        }


        authFactory.my_Company_list=function (data) {
            return $http.post('/api/my_Company_list',data).then(function (response) {
                return response.data;
            })
        };


        authFactory.my_Contact_list=function (data) {
            return $http.post('/api/my_Contact_list',data).then(function (response) {
                return response.data;
            })
        };

        authFactory.delete_company=function (data) {
            return $http.post('/api/delete_company',data).then(function (response) {
                return response.data;
            })
        }

        authFactory.delete_contact=function (data) {
            return $http.post('/api/delete_contact',data).then(function (response) {
                return response.data;
            })
        }
        authFactory.display_advcompany_result=function (data) {
            return $http.post('/api/advcompany',data).then(function (response) {
                return response.data;

            })

        }
    authFactory.display_advpeople_result=function (data) {
        return $http.post('/api/advpeople',data).then(function (response) {
            return response.data;

        })

    }

        return authFactory;
    })

.factory('AuthToken',function ($window) {
    var authtokenFactory={};

    authtokenFactory.setToken=function (token) {
        if(token) {
            $window.localStorage.setItem('token', token)
        }
        else {
            $window.localStorage.removeItem('token')
        }

    };
    authtokenFactory.getToken=function () {
        return $window.localStorage.getItem('token');

    };

    return authtokenFactory;


})

    .factory("AuthInterceptors",function (AuthToken) {
        var authInterceptors={};
        authInterceptors.request=function (config) {
            var token=AuthToken.getToken();
            if(token)
            {
                config.headers['x-access-token']=token;
            }
            return config;

        };
        return authInterceptors;

    })

