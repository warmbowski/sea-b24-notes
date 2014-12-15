'use strict';

require('../../app/js/client');
require('angular-mocks');

describe('resource service', function() {
  beforeEach(angular.mock.module('notesApp'));
  var Service;
  var $cookies = {jwt: '9999999999999999999'};
  var authService;

  beforeEach(angular.mock.inject(function(AuthCheck, $cookies) {
    Service = AuthCheck;
    authService = new Service();
  }));

  it('should sign out a signed in user and redirect to /users', function() {
    var test = authService.signOut();
    console.log(test);
    expect($cookies.jwt).toEqual('');
  });
  
  it('should redirect to /users if user is not signed in');
});
