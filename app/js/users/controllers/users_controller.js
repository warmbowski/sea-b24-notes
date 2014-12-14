'use strict';
module.exports = function(app) {
  app.controller('UsersCtrl', ['$scope', '$http', '$cookies', '$base64', '$location', function($scope, $http, $cookies, $base64, $location) {
    $scope.errors = [];
    $scope.signIn = function() {
      $scope.errors = [];
      console.log($scope.user.email);
      console.log($scope.user.password);
      $http.defaults.headers.common['Authorization'] = 'Basic ' + $base64.encode($scope.user.email + ':' + $scope.user.password);//jshint ignore:line

      $http({
        method: 'GET',
        url: '/api/users/'
      })
      .success(function(data) {
        console.log('success');
        $cookies.jwt = data.jwt;
        $location.path('/notes');
      })
      .error(function(data) {
        console.log('error!');
        console.log(data);
        $scope.errors.push(data);
      });
    };

    $scope.signUp = function() {
      $scope.errors = [];
      if ($scope.newUser.password !== $scope.newUser.passwordConfirmation) $scope.errors.push({msg: 'password and confirmation did not match'});
      if (!$scope.newUser.email) $scope.errors.push({msg: 'did note specify a email'});

      if ($scope.errors.length) return;

      $http({
        method: 'POST',
        url: '/api/users/',
        data: $scope.newUser
      })
      .success(function(data) {
        console.log('success!');
        $cookies.jwt = data.jwt;
        $location.path('/notes');
      })
      .error(function(data) {
        console.log(data);
        $scope.errors.push(data);
      });
    };
  }]);
};
