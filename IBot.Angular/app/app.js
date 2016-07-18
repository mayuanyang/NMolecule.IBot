// Angular itself is load from index.html

import traceur from './traceur-runtime';
import router from './angular-ui-router';
import angularBusy from './angular-busy';
import angularScroll from './angular-scroll';
import httpService from './httpService';
import guidFactory from './guidFactory';
import angularToggleSwitch from './angular-toggle-switch'; 
import chart from './chart.js'; 
import angularchart from './angular-chart.js';
import uiboot from './ui-bootstrap-tpls';
import homeLayoutController from './homeLayoutController';

import dynamicTemplate from './dynamicTemplate';
import loadDirective from './loadDirective';

console.log("version: " + angular.version.full);
var myApp = angular.module('myApp', ['ui.router', 'cgBusy', 'duScroll', 'toggle-switch','ui.bootstrap', 'dynamicTemplateDirective', 'loadDynamicTemplateDirective'])
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


