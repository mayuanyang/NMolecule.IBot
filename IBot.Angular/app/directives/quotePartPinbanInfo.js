import angular from 'angular';
angular.module('quotePartPinbanInfoDirective',[]).directive('pinbanInfo', function(){
    var directive = {};
    directive.restrict = 'E';
    directive.scope = {
        selectedResult : '='
    };

    directive.templateUrl = "/app/directives/quotePartPinbanInfo.html";
    return directive;
});