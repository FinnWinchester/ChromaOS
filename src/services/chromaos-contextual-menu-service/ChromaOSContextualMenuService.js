(function(angular) {
  'use strict';

  function ChromaOSContextualMenuService($, $q, $http, $compile, $templateCache) {

    var self = this;

    this.render = function() {
      var defer = $q.defer();
      defer.resolve($templateCache.get('modules/chromaos-contextual-menu/directives/ChromaOSContextualMenuDirectiveTemplate.html'));
      return defer.promise;
    };

    this.closeContextualMenus = function() {
      $('.chromaos-contextual-menu').remove();
    };

    this.$init = function(element, hasContextualMenu, $scope) {
      $(element).on('contextmenu', function(e) {
        self.closeContextualMenus();
        // Only if 'chromaosContextualMenu' has parameters.
        // If has not this parameter we only disable the contextual menu.
        if (hasContextualMenu) {
          self.render().then(function(result) {
            var compiled = $compile(result)($scope, function(a, b) {
              var parent = $(element).parent();
              parent.append(a);
              parent.find('.chromaos-contextual-menu')
                .css('left', (e.pageX) + 'px')
                .css('top', (e.pageY) + 'px');

              a.on('click', function() {
                self.closeContextualMenus();
              });
            });
          });
        }
        return false;
      });
    };

    var factory = {
      $init: this.$init,
      closeContextualMenus: this.closeContextualMenus
    };

    return factory;
  }

  angular.module('ChromaOS.Services')

  .factory('ChromaOSContextualMenuService', ChromaOSContextualMenuService);

  ChromaOSContextualMenuService.$inject = ['$', '$q', '$http', '$compile', '$templateCache'];
})(window.angular);
