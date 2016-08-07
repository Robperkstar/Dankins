'use strict';
/*jslint white: true*/
  
angular.module('dankinsApp')

.controller('ProgramController', ['$scope', 'programFactory', function ($scope, programFactory) {

    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
   // $scope.showFavorites = false;
    $scope.showProgram = false;
    $scope.message = "Loading ...";

    programFactory.query(
        function (response) {
            $scope.programs = response;
            $scope.showProgram = true;

        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "artFocus";
        } else if (setTab === 3) {
            $scope.filtText = "scienceFocus";
        } else if (setTab === 4) {
            $scope.filtText = "sportFocus";
        } else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

    /*$scope.toggleFavorites = function () {
        $scope.showFavorites = !$scope.showFavorites;
    };
    
    $scope.addToFavorites = function(programid) {
        console.log('Add to favorites', programid);
        favoriteFactory.save({_id: programid});
        $scope.showFavorites = !$scope.showFavorites;
    };*/
}])

.controller('ContactController', ['$scope', 'feedbackFactory', function ($scope, feedbackFactory) {

    $scope.feedback = {
        mychannel: "",
        firstName: "",
        lastName: "",
        agree: false,
        email: ""
    };

    var channels = [{
        value: "tel",
        label: "Tel."
    }, {
        value: "Email",
        label: "Email"
    }];

    $scope.channels = channels;
    $scope.invalidChannelSelection = false;

    $scope.requestInformation = function () {


        if ($scope.feedback.agree && ($scope.feedback.mychannel == "")) {
            $scope.invalidChannelSelection = true;
        } else {
            $scope.invalidChannelSelection = false;
            feedbackFactory.save($scope.feedback);
            $scope.feedback = {
                mychannel: "",
                firstName: "",
                lastName: "",
                agree: false,
                email: ""
            };
            $scope.feedback.mychannel = "";
            $scope.infoForm.$setPristine();
        }
    };
}])

.controller('ProgramDetailController', ['$scope', '$state', '$stateParams', 'programFactory', 'commentFactory', function ($scope, $state, $stateParams, programFactory, commentFactory) {

    $scope.program = {};
    $scope.showProgram = false;
    $scope.message = "Loading ...";

    $scope.program = programFactory.get({
            id: $stateParams.id
        })
        .$promise.then(
            function (response) {
                $scope.programlist = response;
                $scope.showProgram = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

    $scope.mycomment = {
        rating: 5,
        comment: ""
    };

    $scope.submitComment = function () {

        commentFactory.save({id: $stateParams.id}, $scope.mycomment);

        $state.go($state.current, {}, {reload: true});
        
        $scope.commentForm.$setPristine();

        $scope.mycomment = {
            rating: 5,
            comment: ""
        };
    }
}])

// implement the IndexController and About Controller here

.controller('HomeController', ['$scope', 'programFactory', 'corporateFactory', 'promotionFactory', function ($scope, programFactory, corporateFactory, promotionFactory) {
    $scope.showProgram = false;
    $scope.showLeader = false;
    $scope.showPromotion = false;
    $scope.message = "Loading ...";
    var leaders = corporateFactory.query({
            featured: "true"
        })
        .$promise.then(
            function (response) {
                var leaders = response;
                $scope.leader = leaders[0];
                $scope.showLeader = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
    $scope.program = programFactory.query({
            featured: "true"
        })
        .$promise.then(
            function (response) {
                var programs = response;
                $scope.program = programs[0];
                $scope.showProgram = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
    var promotions = promotionFactory.query({
        featured: "true"
    })
    .$promise.then(
            function (response) {
                var promotions = response;
                $scope.promotion = promotions[0];
                $scope.showPromotion = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );
}])

.controller('AboutController', ['$scope', 'corporateFactory', function ($scope, corporateFactory) {

    $scope.leaders = corporateFactory.query();

}])



.controller('PhotoController', ['$scope', 'photoFactory', function ($scope, photoFactory) {

    $scope.photos = photoFactory.query();
     
}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

    $scope.loggedIn = false;
    $scope.username = '';
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
    };
    
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    
    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };
            
    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };
    $scope.openForgotPassword = function () {
        ngDialog.open({ template: 'views/forgotpassword.html', scope: $scope, className: 'ngdialog-theme-default', controller:"ResetPasswordCtrl" });
    };
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {
    
    $scope.register={};
    $scope.loginData={};
    
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);
        
        ngDialog.close();

    };
}])



.controller('MapController', function(NgMap) {
    var vm = this;
  NgMap.getMap().then(function(map) {
  vm.showCustomMarker= function(evt) {
  map.customMarkers.foo.setVisible(true);
  map.customMarkers.foo.setPosition(this.getPosition());
          };
      vm.closeCustomMarker= function(evt) {
            this.style.display = 'none';
          };
    console.log(map.getCenter());
    console.log('markers', map.markers);
    console.log('shapes', map.shapes);
  });
});

controllers.controller('ResetPasswordCtrl', ['$scope', '$location', 'UserService',
      function ResetPasswordCtrl($scope, $location, UserService) {
        
        // action handler for ng-click on form
            $scope.resetPassword = function() {
                UserService.resetPassword({email: $scope.resetPasswordEmail}, $scope.successHandlerResetPassword, $scope.errorHandler);
            };

            $scope.errorHandler = function(error) {
                  console.log(error);
                  $location.path('/error');
            };

        $scope.successHandlerResetPassword = function(httpResponse) {
              console.log('SUCCESS!');
              $location.path('/home');             
        };
               
    }]);