import angular from 'angular';
angular.module('enterPressDirective',[]).directive('enterPress', ['$compile', function($compile){
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.enterPress);
                });

                event.preventDefault();
            }
        });
    };
}]);