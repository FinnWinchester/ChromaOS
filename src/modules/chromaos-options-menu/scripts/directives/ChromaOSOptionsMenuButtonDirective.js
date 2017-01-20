(function(angular) {
  'use strict';

  function ChromaOSOptionsMenuButtonDirective(ChromaOSOptionsMenuService, $rootScope) {

    function ChromaOSOptionsMenuButtonDirectiveLink($scope, $element, $attrs, $controller) {
			$scope.opened = false;
			$rootScope.$on('chromaos.options-menu.close', function(e, args) {
				ChromaOSOptionsMenuService.$close($element);
				$scope.opened = false;
			});

      $scope.toggleOptionsMenu = function() {
				if (!$scope.opened) {
          ChromaOSOptionsMenuService.$open($element, $scope.chromaosOptionsMenuButton);
        } else {
          ChromaOSOptionsMenuService.$close($element);
        }
        $scope.opened = !$scope.opened;
      };
    }

    var directive = {
      restrict: 'A',
      scope: {
        chromaosOptionsMenuButton: '='
      },
      templateUrl: 'modules/chromaos-options-menu/scripts/views/ChromaOSOptionsMenuButtonDirectiveTemplate.html',
      link: ChromaOSOptionsMenuButtonDirectiveLink
    };

    return directive;
  }

  angular.module('ChromaOS.Modules.OptionsMenu')

  .directive('chromaosOptionsMenuButton', ChromaOSOptionsMenuButtonDirective);

  ChromaOSOptionsMenuButtonDirective.$inject = ['ChromaOSOptionsMenuService', '$rootScope'];
})(window.angular);
