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


import quotePartPinbanInfo from './quotePartPinbanInfo';
import dynamicTemplate from './dynamicTemplate';

console.log("version: " + angular.version.full);
var myApp = angular.module('myApp', ['ui.router', 'cgBusy', 'duScroll','quotePartPinbanInfoDirective', 'toggle-switch','chart.js','ui.bootstrap', 'dynamicTemplateDirective'])
	.controller('homeLayoutController', homeLayoutController)
	.factory('guidFactory', guidFactory.createFactory)
	.service('httpService', httpService);

myApp.config(['$stateProvider', '$urlRouterProvider','$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
	// For any unmatched url, redirect to /state1
	$urlRouterProvider.otherwise("/");
	
	// Use WithCredentials
	$httpProvider.defaults.withCredentials = true;
	
	// Now set up the states
        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "views/shared/_homelayout.html",
                controller: "homeLayoutController as model"
            });
    }])

.factory('httpInterceptor', ['$q', '$rootScope', '$injector', '$timeout',
    function ($q, $rootScope, $injector, $timeout) {
		function completeBusy(result) {
			result.config.busyDeferred.resolve();
		}
		
		
		function removeItemFromErrorMessages(){
			if($rootScope.errorMessages != null && $rootScope.errorMessages.length > 0){
				$rootScope.errorMessages.pop();
			}
		}
		function clearServerErrors(){
			$rootScope.serverErrors = [];
		}
		function clearMessages(){
			$rootScope.errorMessages = [];
		}
		
		function addMessage(message) {

			if ($rootScope.errorMessages == null) {
				$rootScope.errorMessages = [];
			}
			$rootScope.errorMessages.splice(0, 0, message);
		}
		
		return {
			'request': function(config) {
			    var deferred = $q.defer();

			    var accesstoken = localStorage.getItem('accessToken');
 
			    var authHeaders = {};
			    if (accesstoken) {
			        authHeaders.Authorization = 'Bearer ' + accesstoken;
			        config.headers['Authorization'] = 'Bearer ' + accesstoken;
			    }
			    //console.log(config);
			    //console.log(config.headers[0]);
			    

				$rootScope.myPromise = deferred.promise;
				config.busyDeferred = deferred;
				return config || $q.when(config);
			},

			'response': function(response) {
				completeBusy(response);
				return response || $q.when(response);
			},
			'requestError': function (rejection) {
				completeBusy(rejection);
				return $q.reject(rejection);
            },
			'responseError': function (rejection) {
				if (rejection.status === 401) {
					addMessage({
						type: "warning",
						message: rejection.statusText + ", 你没有权限进行此操作"
					});
					

				} else if (rejection.status >= 400 && rejection.status < 500 ) {
					addMessage({
						type: "warning",
						message: rejection.data
					});
				
					var serverErrors = {}
					var len = rejection.data.length;
					for(var i = 0; i < len; i++)
					{
						var error = rejection.data[i];
						serverErrors[error.location] = error.message;
					}
					$rootScope.serverErrors = serverErrors;
				}
				else if (rejection.status >= 500 && rejection.status < 600) {
					
					addMessage({
						type: "danger",
						message: rejection.data.exceptionMessage
					});
				
				}else{
					addMessage({
						type: "danger",
						message: "Could not connect to the API, the server may be down or there may be an issue with your connection"
					});
				}
				completeBusy(rejection);
				return $q.reject(rejection);
            }
		};
    }
])

.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
}]);


