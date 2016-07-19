import angular from 'angular';
//Directive for adding buttons on click that show an alert on click
angular.module('loadDynamicTemplateDirective',[]).directive('loadDirective', ['$compile', function($compile){
	var directive = {};
    directive.restrict = 'AE';
    directive.scope = { models: '=models' };
    directive.link = function (scope, elm, attrs) {
        scope.$watch(function(){return scope.models;}, function() {
            if (scope.models.length > 0) {
                var output = '';
            var index =  scope.models.length - 1;
            var name = scope.models[index].name;
            output += '<dynamic-template data="this.models[' + index + '].data" name="' + name + '"' + '></dynamic-template>';
            
            elm.append($compile(output)(scope));
            }
            
        }, true);
    };
	return directive;
}]);