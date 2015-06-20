// AngularJS Test Code use Directive
var app = angular.module("app", []);

// make html cache for app
app.run(function($templateCache) {
    $templateCache.put('mycache.html', 
                       '<h1>DO html whatever you want</h1>' +
                       'Hello {{myData.name}} - age: {{myData.age}}' +
                       '</br> Look at the console log'
                       );    
});

app.directive('myDirective', function() {
    return {
        restrict: 'EA',
        //template: '<h1>a ha</h1>',
        templateUrl: 'mycache.html',
        scope: {
            myData: '=tot',
            doit: '&doSomething',
            itDo: '&do2do'
        },
        link: function(scope, element, attr) {
            console.log('do this directive...');
            scope.doit();
            scope.itDo();
        }
    };
});

app.controller('test1', function($scope) {
    $scope.tot1 = {
        name: 'Trieu',
        age: 25
    };
    $scope.test = function() {
        console.log('this is call function test');
    };
    $scope.ops = function() {
        console.log('this is call function ops');
    };
});