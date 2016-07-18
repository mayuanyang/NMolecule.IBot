"use strict";
var $__angular__;
var angular = ($__angular__ = require("angular"), $__angular__ && $__angular__.__esModule && $__angular__ || {default: $__angular__}).default;
angular.module('loadDynamicTemplateDirective', []).directive('loadDirective', ['$compile', function($compile) {
  var directive = {};
  directive.restrict = 'E';
  directive.scope = {models: '=models'};
  directive.link = function(scope, elm, attrs) {
    var output = '';
    for (var m in scope.models) {
      console.log(m);
      var name = scope.models[m].name;
      output += '<dynamic-template data="this.models[' + m + '].data" name="' + name + '"' + '></dynamic-template>';
    }
    elm.append($compile(output)(scope));
  };
  return directive;
}]);

//# sourceMappingURL=loadDirective.js.map
