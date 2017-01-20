(function(angular) {
  'use strict';

  function ChromaOSResponsivenessService($) {

    function respond(element) {

      var w = element.width();
      var params = {
        xs: {
          size: 350,
          class: 'chromaos-window-xs'
        },
        sm: {
          size: 500,
          class: 'chromaos-window-sm'
        },
        md: {
          size: 750,
          class: 'chromaos-window-md'
        },
        lg: {
          size: 900,
          class: 'chromaos-window-lg'
        },
        xl: {
          size: 901,
          class: 'chromaos-window-xl'
        }
      };

      var resetClasses = function(element) {
        element.removeClass(params.xs.class);
        element.removeClass(params.sm.class);
        element.removeClass(params.md.class);
        element.removeClass(params.lg.class);
        element.removeClass(params.xl.class);
      };

      var addClass = function(element, param) {
        element.addClass(param.class);
      };

      switch (true) {
        case (w <= params.xs.size):
          resetClasses(element);
          addClass(element, params.xs);
          break;
        case (w > params.xs.size && w <= params.sm.size):
          resetClasses(element);
          addClass(element, params.sm);
          break;
        case (w > params.sm.size && w <= params.md.size):
          resetClasses(element);
          addClass(element, params.md);
          break;
        case (w > params.md.size && w <= params.lg.size):
          resetClasses(element);
          addClass(element, params.lg);
          break;
        case (w > params.lg.size):
          resetClasses(element);
          addClass(element, params.xl);
          break;
      }
    }

    var factory = {
      respond: respond
    };

    return factory;
  }

  angular.module('ChromaOS.Services')

  .factory('ChromaOSResponsivenessService', ChromaOSResponsivenessService);

  ChromaOSResponsivenessService.$inject = ['$'];
})(window.angular);
