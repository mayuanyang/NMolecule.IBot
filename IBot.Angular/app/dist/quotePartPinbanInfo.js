"use strict";
var $__angular__;
var angular = ($__angular__ = require("angular"), $__angular__ && $__angular__.__esModule && $__angular__ || {default: $__angular__}).default;
angular.module('quotePartPinbanInfoDirective', []).directive('pinbanInfo', function() {
  var directive = {};
  directive.restrict = 'E';
  directive.scope = {selectedResult: '='};
  directive.templateUrl = "/app/directives/quotePartPinbanInfo.html";
  return directive;
});

//# sourceMappingURL=quotePartPinbanInfo.js.map
