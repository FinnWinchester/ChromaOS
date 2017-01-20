/* global $:false */
(function(angular) {
  'use strict';

  function runFunction(ChromaOSOptionsMenuService, $rootScope) {
    // $(document).keydown(function(event) {
    //   if (event.keyCode === 123 || event.which === 123) {
    //     return false;
    //   } else if (event.ctrlKey && event.shiftKey && event.keyCode === 73) {
    //     return false; //Prevent from ctrl+shift+i
    //   }
    // });

    $(document).ready(function() {
      $('.chromaos-desktop').on('click', function(e) {
        if ($(e.target).hasClass('chromaos-desktop')) {
          $('.chromaos-contextual-menu').remove();
          $rootScope.$broadcast('chromaos.desktop.focus', {});
        }
      });

      $(document).on('mousedown', function(e) {
        // Needed for options menu three dots button.
        if ([e.target.className, e.target.parentNode.className].indexOf('chromaos-options-menu-wrapper-button') === -1) {
          if (ChromaOSOptionsMenuService.isOpened()) {
            $rootScope.$broadcast('chromaos.options-menu.close', {});
          }
        }
      });

      $(document).on('contextmenu', function() {
        $('.chromaos-contextual-menu').remove();
        return false;
      });
    });
  }

  angular.module('ChromaOS.Kernel', [])

  .constant('$', $)

  .run(runFunction);

  runFunction.$inject = ['ChromaOSOptionsMenuService', '$rootScope'];

})(window.angular);
