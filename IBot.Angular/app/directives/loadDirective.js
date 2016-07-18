import angular from 'angular';
//Directive for adding buttons on click that show an alert on click
angular.module('loadDynamicTemplateDirective',[]).directive('loadDirective', ['$compile', function($compile){
	var directive = {};
    directive.restrict = 'E';
    directive.scope = { models: '=models' };
	directive.link = function (scope, elm, attrs) {
		var output = '';
		for(var m in scope.models){
			console.log(m);
			var name = scope.models[m].name;
			output += '<dynamic-template data="this.models[' + m + '].data" name="' + name + '"' + '></dynamic-template>';
		}
		elm.append($compile(output)(scope));
	};
	return directive;
}]);