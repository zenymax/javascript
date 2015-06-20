// <grid-screen resource="data.js">
//     <grid-columns>
//         <grid-column title="Product" field="product" />
//         <grid-column title="Description" field="description" />
//         <grid-column title="Cost" field="cost" />
//     </grid-columns>
//     <grid with-inline-editor></grid>
// </grid-screen>

angular.module('myapp', []).directive('gridScreen', ['$http', function($http){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		controller: function($scope, $element, $attrs, $transclude) {
			// $http.get($attrs.resource).success(function(data) {
			// 	$scope.rows = data.data;
			// 	// this is $scope of link
			// 	$scope.$broadcast('ready-to-render', $scope.cols, $scope.rows);
			// });

			this.setColumns = function(cols) {
				console.log("ccccccccccc ", cols);
				$scope.cols = cols;
			};
			this.setEditor = function(editor) {
				$scope.cols.unshift(editor);
			};
		},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function(scope, iElm, iAttrs, controller) {
			$http.get(iAttrs.resource).success(function(data) {
				scope.rows = data.data;
				// this is $scope of link
				scope.$broadcast('ready-to-render', scope.cols, scope.rows);
			});
		}	
	};
}]).directive('gridColumns', ['$http', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		controller: function($scope, $element, $attrs, $transclude) {
			var columns = [];
			this.addColumn = function(col) {
				columns.push(col);
			};
			this.getColumns = function() {
				return columns;
			};
		},
		require: ['^gridScreen', 'gridColumns'], // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: {
			pre: function($scope, iElm, iAttrs, controllers) {
				console.log("grid-columns init: open tag");	
			},
			// controllers is arr of require line 55
			post: function($scope, iElm, iAttrs, controllers) {
				var gridScreenController = controllers[0];
				var gridColumnsController = controllers[1];
				gridScreenController.setColumns(gridColumnsController.getColumns());
				console.log("grid-columns init: close tag ", gridColumnsController.getColumns());
			}
		}
	};
}]).directive('gridColumn', ['$http', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		require: '^gridColumns', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, gridColumnsController) {
			gridColumnsController.addColumn({
				title: iAttrs.title,
				field: iAttrs.field
			});
			console.log("grid-column init ", iAttrs.title, iAttrs.field);
		}
	};
}]).directive('grid', ['$http', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		controller: function($scope, $element, $attrs, $transclude) {
			$scope.$on('ready-to-render', function(e, cols, rows) {
				$scope.cols = cols;
				$scope.rows = rows;
				console.log("cols: ", cols);
				console.log("rows: ", rows);
			});
		},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		templateUrl: 'template.html',
		replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function(scope, iElm, iAttrs, controller) {
			console.log("grid init");
		}
	};
}]).directive('withInlineEditor', ['$http', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		require: '^gridScreen', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, gridScreenController) {
			console.log("with-inline-editor init ", iAttrs);
			gridScreenController.setEditor({
				title:'Edit',
				field:''
			});
		}
	};
}]).directive('editorInitalizer', ['$http', function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		controller: function($scope, $element, $attrs, $transclude) {
			$scope.edit = function(row) {
				//console.log("edit row: ", row);
				$scope.$broadcast('edit', row);
			};
		},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
		template: '<a href="" ng-click="edit(row)">&#9654;</a>',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, iElm, iAttrs, controller) {
			$scope.$on('edit', function(e, row) {
				console.log("row: ", row);
			});
			console.log("is linked");
		}
	};
}]);