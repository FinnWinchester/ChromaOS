(function(angular) {

  function runFunction(ChromaOSAppsService) {
    ChromaOSAppsService.register({
      id: 'shopping-app',
      name: 'Shopping App',
      icon: 'fa fa-shopping-cart',
      template: '<div shopping-app></div>',
      launcher: true,
      config: {
        behavior: {
          resizable: true, // true/false
          draggable: true, // true/false
          fullScreenable: true, // true/false
          collapsable: true, // true/false
          minimizable: true, // true/false
          closeable: true, // true/false
        },
        size: {
          width: '550px', // px
          height: '500px', // px
        },
        borderless: true,
        fullscreen: true,
        startAt: 6
      }
    });
  }

  function ShoppingAppDirective() {

    function ShoppingAppDirectiveLink($scope) {
      $scope.shopList = [];

      var addElement = function(element) {
        $scope.shopList.push(element);
      };

      $scope.createElement = function() {
        if (isNaN($scope.units) || isNaN($scope.unitaryPrice)) {

        } else {
          addElement({
            name: $scope.name,
            units: $scope.units,
            unitaryPrice: $scope.unitaryPrice,
          });
          $scope.$emit('chromaos.window.dirty.make_dirty', {
            dirty: true
          });
          $scope.$emit('chromaos.window.dirty.change_message', {
            message: 'Message before close.'
          });
          $scope.name = '';
          $scope.units = '';
          $scope.unitaryPrice = '';
        }
      };

      $scope.makeIt = function(what) {
        $scope.$emit('chromaos.window.header.border', {
          borderless: what
        });
      };
    }

    var directive = {
      restrict: 'A',
      scope: {},
      templateUrl: 'app/ShoppingApp/ShoppingAppDirectiveTemplate.html',
      link: ShoppingAppDirectiveLink
    };

    return directive;

  }

  angular.module('myapp')

  .directive('shoppingApp', ShoppingAppDirective)

  .run(runFunction);

  // ShoppingAppDirective.$inject = ['$scope'];
  runFunction.$inject = ['ChromaOSAppsService'];

})(window.angular);