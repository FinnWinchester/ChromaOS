(function(angular) {
  'use strict';

  function ChromaOSContextualMenuDirective(ChromaOSContextualMenuService) {

    function ChromaOSContextualMenuDirectiveLink($scope, $element, $attrs, $controller) {
			ChromaOSContextualMenuService.$init($element, $scope.chromaosContextualMenu, $scope);
    }

    var directive = {
      restrict: 'A',
      scope: {
        chromaosContextualMenu: '='
      },
      link: ChromaOSContextualMenuDirectiveLink
    };

    return directive;
  }

  angular.module('ChromaOS.Modules.ContextualMenu')

  .directive('chromaosContextualMenu', ChromaOSContextualMenuDirective);

  ChromaOSContextualMenuDirective.$inject = ['ChromaOSContextualMenuService'];
})(window.angular);
