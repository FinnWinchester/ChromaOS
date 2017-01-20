(function(angular) {
  'use strict';

  function ChromaOSWindowPanelCompilerDirective($compile) {

    function ChromaOSWindowPanelCompilerDirectiveLink($scope, $element, $attrs, $controller) {
			var compiledTemplate = $compile($scope.tpl)($scope);
			$element.replaceWith(compiledTemplate);
			$element = compiledTemplate;
			$element.css('height', '100%');
			$element.css('width', '100%');
    }

    var directive = {
      restrict: 'EA',
      scope: {
        tpl: '='
      },
      templateUrl: 'modules/chromaos-window-panel/directives/views/ChromaOSWindowPanelCompilerDirectiveTemplate.html',
      link: ChromaOSWindowPanelCompilerDirectiveLink
    };

    return directive;
  }

  angular.module('ChromaOS.Modules.WindowPanel')

  .directive('chromaosWindowPanelCompiler', ChromaOSWindowPanelCompilerDirective);

  ChromaOSWindowPanelCompilerDirective.$inject = ['$compile'];
})(window.angular);
