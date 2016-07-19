"use strict";
var $__angular__;
var angular = ($__angular__ = require("angular"), $__angular__ && $__angular__.__esModule && $__angular__ || {default: $__angular__}).default;
angular.module('loadDynamicTemplateDirective', []).directive('loadDirective', ['$compile', function($compile) {
  var directive = {};
  directive.restrict = 'AE';
  directive.scope = {models: '=models'};
  directive.link = function(scope, elm, attrs) {
    scope.$watch(function() {
      return scope.models;
    }, function() {
      if (scope.models.length > 0) {
        var output = '';
        var index = scope.models.length - 1;
        var name = scope.models[index].name;
        output += '<dynamic-template data="this.models[' + index + '].data" name="' + name + '"' + '></dynamic-template>';
        elm.append($compile(output)(scope));
      }
    }, true);
  };
  return directive;
}]);

//# sourceMappingURL=loadDirective.js.map
