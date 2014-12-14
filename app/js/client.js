'use strict';
require('angular/angular');
require('angular-route');
require('angular-cookies');
require('angular-base64');

var notesApp = angular.module('notesApp', ['ngRoute', 'ng-cookies', 'base64']);

require('./users/users')(notesApp);

//directives
require('./notes/directives/new_note_form_direc')(notesApp);

//services
require('./services/resource_backend_service')(notesApp);

//controllers
require('./notes/controllers/notes_controller')(notesApp);

notesApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/notes', {
    templateUrl: 'templates/notes/notes_template.html',
    controller: 'notesCtrl'
  })
  .when('/users', {
    templateUrl: 'templates/users/users_view.html',
    contoller: 'UsersCtrl'
  })
  .otherwise({
    redirectTo: '/users'
  });
}]);
