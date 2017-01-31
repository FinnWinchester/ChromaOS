(function(angular) {

  function runFunction(ChromaOSAppsService) {
    ChromaOSAppsService.register({
      id: 'test-app',
      name: 'Test App',
      icon: 'fa fa-check fa-fw',
      template: '<div test-app></div>',
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
        borderless: false,
        fullscreen: false,
        startAt: 1,
        autostart: true
      }
    });
  }

  function TestAppDirective(ChromaOSAppsService) {

    function TestAppDirectiveLink($scope) {

      /*$scope.makeIt = function(what) {
        $scope.$emit('chromaos.window.header.border', {
          borderless: what
        });
      };*/

      $scope.changeTitle = function() {
        $scope.$emit('chromaos.app.retitle', {
          title: $scope.title
        });
      };

      $scope.resetTitle = function() {
        $scope.$emit('chromaos.app.retitle', {
          reset: true
        });
      };

      $scope.changeIcon = function(icon) {
        $scope.$emit('chromaos.app.reicon', {
          icon: icon
        });
      };

      $scope.resetIcon = function() {
        $scope.$emit('chromaos.app.reicon', {
          icon: ChromaOSAppsService.findApp('test-app').icon
        });
      };

    }

    var directive = {
      restrict: 'A',
      scope: {},
      templateUrl: 'app/TestApp/TestAppDirectiveTemplate.html',
      link: TestAppDirectiveLink
    };

    return directive;

  }

  angular.module('myapp')

    .directive('testApp', TestAppDirective)

    .run(runFunction);

  TestAppDirective.$inject = ['ChromaOSAppsService'];
  runFunction.$inject = ['ChromaOSAppsService'];

})(window.angular);
