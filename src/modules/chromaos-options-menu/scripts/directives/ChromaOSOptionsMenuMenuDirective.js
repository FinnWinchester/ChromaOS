(function(angular) {
  'use strict';

  function ChromaOSOptionsMenuMenuDirective(ChromaOSOptionsMenuService, $) {

    function ChromaOSOptionsMenuMenuDirectiveCompile($scope, $attrs) {

    }

    var directive = {
      restrict: 'A',
      scope: {
        chromaosOptionsMenuMenu: '='
      },
      templateUrl: 'modules/chromaos-options-menu/scripts/views/ChromaOSOptionsMenuMenuDirectiveTemplate.html',
      compile: ChromaOSOptionsMenuMenuDirectiveCompile
    };

    return directive;
  }

  angular.module('ChromaOS.Modules.OptionsMenu')

  .directive('chromaosOptionsMenuMenu', ChromaOSOptionsMenuMenuDirective);

  ChromaOSOptionsMenuMenuDirective.$inject = ['ChromaOSOptionsMenuService', '$'];
})(window.angular);
