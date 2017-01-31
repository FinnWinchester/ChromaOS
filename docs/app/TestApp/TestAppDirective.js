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
        $scope.$emit('chromaos.window.retitle', {
          title: $scope.title
        });
      };

      $scope.resetTitle = function() {
        $scope.$emit('chromaos.window.retitle', {
          reset: true
        });
      };

      $scope.changeIcon = function(icon) {
        $scope.$emit('chromaos.window.reicon', {
          icon: icon
        });
      };

      $scope.resetIcon = function() {
        $scope.$emit('chromaos.window.reicon', {
          icon: ChromaOSAppsService.findApp('test-app').icon
        });
      };

      $scope.fullscreen = function() {
        $scope.$emit('chromaos.window.fire.full-screen', {});
      };

      $scope.restore = function() {
        $scope.$emit('chromaos.window.fire.restore', {});
      };

      $scope.minimize = function() {
        $scope.$emit('chromaos.window.fire.minimize', {});
      };

      $scope.windowed = function() {
        $scope.$emit('chromaos.window.fire.windowed', {});
      };

      $scope.collapse = function() {
        $scope.$emit('chromaos.window.fire.collapse', {});
      };

      $scope.expand = function() {
        $scope.$emit('chromaos.window.fire.expand', {});
      };

      $scope.resize = function(width, height) {
        $scope.$emit('chromaos.window.resize', {
          size: {
            width: width,
            height: height
          }
        });
      };

      $scope.borderless = function(borderless) {
        $scope.$emit('chromaos.window.borderless', {
          borderless: borderless
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
