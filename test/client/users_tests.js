'use strict';

require('../../app/js/client');
require('angular-mocks');

describe('UsersController', function() {
  var $controllerConstructor;
  var $httpBackend;
  var $scope;
  var $cookies = {};

  beforeEach(angular.mock.module('notesApp'));

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    $controllerConstructor = $controller;
  }));

  it('should be able to create a controller', function() {
    var notesController = $controllerConstructor('UsersCtrl', {$scope: $scope});
    expect(typeof notesController).toBe('object');
  });

  describe('rest requests', function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $controllerConstructor('UsersCtrl', {$scope: $scope, $cookies: $cookies});
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should login to get a token', function() {
      $httpBackend.expectGET('/api/users').respond(200, {jwt: '9999999999999999999'});

      $scope.user = {
        email: 'me@example.com',
        password: 'foobarfoo'
      };
      $scope.signIn();

      $httpBackend.flush();

      expect($cookies).toEqual({jwt: '9999999999999999999'});
    });

    it('should create a new user', function() {
      $httpBackend.expectPOST('/api/users').respond(200, {jwt: '9999999999999999999'});

      $scope.newUser = {
        email: 'me@example.com',
        password: 'foobarfoo',
        passwordConfirmation: 'foobarfoo'
      };
      $scope.signUp();

      $httpBackend.flush();

      expect($cookies).toEqual({jwt: '9999999999999999999'});
    });

    it('should sign out');
  });
});
