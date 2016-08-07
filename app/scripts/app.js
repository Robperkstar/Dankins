'use strict';

angular.module('dankinsApp', ['ui.router', 'ngResource','ngDialog','ngMap'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        
            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'HomeController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })
        
            // route for the aboutus page
            .state('app.aboutus', {
                url:'aboutus',
                views: {
                    'content@': {
                        templateUrl : 'views/aboutus.html',
                        controller  : 'AboutController'                  
                    }
                }
            })
        
            // route for the contactus page
            .state('app.contactus', {
                url:'contactus',
                views: {
                    'content@': {
                        templateUrl : 'views/contactus.html',
                        controller  : 'ContactController'                  
                    }
                }
            })

            // route for the programlist page
            .state('app.programlist', {
                url: 'programlist',
                views: {
                    'content@': {
                        templateUrl : 'views/programs.html',
                        controller  : 'ProgramController'
                    }
                }
            })

            // route for the dishdetail page
            .state('app.programdetail', {
                url: 'programs/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/programdetail.html',
                        controller  : 'ProgramDetailController'
                   }
                }
            })
        
            // route for the dishdetail page
            .state('app.photos', {
                url: 'photos',
                views: {
                    'content@': {
                        templateUrl : 'views/photos.html',
                        controller  : 'PhotoController'
                   }
                }
            });
    
        $urlRouterProvider.otherwise('/');
    })
;
