'use strict';

module.exports = function(app) {

  app.factory('AuthCheck', ['$cookies', '$location', function($cookies, $location) {
    return function() {
      return {
        signOut: function() {
          $cookies.jwt = '';
          return $location.path('/users');
        },
        isSignedIn: function() {
          if (!$cookies.jwt || !$cookies.jwt.length > 0)//jshint ignore:line
            return $location.path('/users');//jshint ignore:line
        }
      };
    };
  }]);
};
