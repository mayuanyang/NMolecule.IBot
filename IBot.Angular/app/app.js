// Angular itself is load from index.html

import traceur from './traceur-runtime';
import router from './angular-ui-router';
import angularBusy from './angular-busy';
import httpService from './httpService';
import guidFactory from './guidFactory';
import uiboot from './ui-bootstrap-tpls';
import homeLayoutController from './homeLayoutController';
import dynamicTemplate from './dynamicTemplate';
import loadDirective from './loadDirective';
import enterPress from './enterPress';

console.log("version: " + angular.version.full);
var myApp = angular.module('myApp', ['ui.router', 'cgBusy', 'ui.bootstrap', 'dynamicTemplateDirective', 'loadDynamicTemplateDirective', 'enterPressDirective'])
	.controller('homeLayoutController', homeLayoutController)
	.factory('guidFactory', guidFactory.createFactory)
	.service('httpService', httpService);

myApp.config(['$stateProvider', '$urlRouterProvider','$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
	// For any unmatched url, redirect to /state1
	$urlRouterProvider.otherwise("/");
	
	// Use WithCredentials
	$httpProvider.defaults.withCredentials = false;
	
	// Now set up the states
        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "views/shared/_homelayout.html",
                controller: "homeLayoutController as model"
            });
    }]);


