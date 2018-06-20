angular.module('MyApp',['appRoutes','mainController','authServices','angularUtils.directives.dirPagination'])

    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('AuthInterceptors');

    });

