"use strict";
var $__traceur_45_runtime__,
    $__angular_45_ui_45_router__,
    $__angular_45_busy__,
    $__angular_45_scroll__,
    $__httpService__,
    $__guidFactory__,
    $__angular_45_toggle_45_switch__,
    $__chart_46_js__,
    $__angular_45_chart_46_js__,
    $__ui_45_bootstrap_45_tpls__,
    $__homeLayoutController__,
    $__quotePartPinbanInfo__,
    $__dynamicTemplate__;
var traceur = ($__traceur_45_runtime__ = require("./traceur-runtime"), $__traceur_45_runtime__ && $__traceur_45_runtime__.__esModule && $__traceur_45_runtime__ || {default: $__traceur_45_runtime__}).default;
var router = ($__angular_45_ui_45_router__ = require("./angular-ui-router"), $__angular_45_ui_45_router__ && $__angular_45_ui_45_router__.__esModule && $__angular_45_ui_45_router__ || {default: $__angular_45_ui_45_router__}).default;
var angularBusy = ($__angular_45_busy__ = require("./angular-busy"), $__angular_45_busy__ && $__angular_45_busy__.__esModule && $__angular_45_busy__ || {default: $__angular_45_busy__}).default;
var angularScroll = ($__angular_45_scroll__ = require("./angular-scroll"), $__angular_45_scroll__ && $__angular_45_scroll__.__esModule && $__angular_45_scroll__ || {default: $__angular_45_scroll__}).default;
var httpService = ($__httpService__ = require("./httpService"), $__httpService__ && $__httpService__.__esModule && $__httpService__ || {default: $__httpService__}).default;
var guidFactory = ($__guidFactory__ = require("./guidFactory"), $__guidFactory__ && $__guidFactory__.__esModule && $__guidFactory__ || {default: $__guidFactory__}).default;
var angularToggleSwitch = ($__angular_45_toggle_45_switch__ = require("./angular-toggle-switch"), $__angular_45_toggle_45_switch__ && $__angular_45_toggle_45_switch__.__esModule && $__angular_45_toggle_45_switch__ || {default: $__angular_45_toggle_45_switch__}).default;
var chart = ($__chart_46_js__ = require("./chart.js"), $__chart_46_js__ && $__chart_46_js__.__esModule && $__chart_46_js__ || {default: $__chart_46_js__}).default;
var angularchart = ($__angular_45_chart_46_js__ = require("./angular-chart.js"), $__angular_45_chart_46_js__ && $__angular_45_chart_46_js__.__esModule && $__angular_45_chart_46_js__ || {default: $__angular_45_chart_46_js__}).default;
var uiboot = ($__ui_45_bootstrap_45_tpls__ = require("./ui-bootstrap-tpls"), $__ui_45_bootstrap_45_tpls__ && $__ui_45_bootstrap_45_tpls__.__esModule && $__ui_45_bootstrap_45_tpls__ || {default: $__ui_45_bootstrap_45_tpls__}).default;
var homeLayoutController = ($__homeLayoutController__ = require("./homeLayoutController"), $__homeLayoutController__ && $__homeLayoutController__.__esModule && $__homeLayoutController__ || {default: $__homeLayoutController__}).default;
var quotePartPinbanInfo = ($__quotePartPinbanInfo__ = require("./quotePartPinbanInfo"), $__quotePartPinbanInfo__ && $__quotePartPinbanInfo__.__esModule && $__quotePartPinbanInfo__ || {default: $__quotePartPinbanInfo__}).default;
var dynamicTemplate = ($__dynamicTemplate__ = require("./dynamicTemplate"), $__dynamicTemplate__ && $__dynamicTemplate__.__esModule && $__dynamicTemplate__ || {default: $__dynamicTemplate__}).default;
console.log("version: " + angular.version.full);
var myApp = angular.module('myApp', ['ui.router', 'cgBusy', 'duScroll', 'quotePartPinbanInfoDirective', 'toggle-switch', 'chart.js', 'ui.bootstrap', 'dynamicTemplateDirective']).controller('homeLayoutController', homeLayoutController).factory('guidFactory', guidFactory.createFactory).service('httpService', httpService);
myApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
  $urlRouterProvider.otherwise("/");
  $httpProvider.defaults.withCredentials = false;
  $stateProvider.state('home', {
    url: "/",
    templateUrl: "views/shared/_homelayout.html",
    controller: "homeLayoutController as model"
  });
}]);

//# sourceMappingURL=app.js.map
