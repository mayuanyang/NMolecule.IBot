"use strict";
var $__angular__;
var angular = ($__angular__ = require("angular"), $__angular__ && $__angular__.__esModule && $__angular__ || {default: $__angular__}).default;
angular.module('enterPressDirective', []).directive('enterPress', ['$compile', function($compile) {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.enterPress);
        });
        event.preventDefault();
      }
    });
  };
}]);

//# sourceMappingURL=enterPress.js.map
