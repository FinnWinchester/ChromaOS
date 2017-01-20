(function(angular) {
  'use strict';

  function ChromaOSOptionsMenuService($, $q, $http, $compile, $templateCache, $rootScope) {

    var self = this;
    var openedClass = 'chromaos-options-menu-opened';
    var opened = false;

    this.render = function(options) {
      var defer = $q.defer();
      var newScope = $rootScope.$new(true);
      newScope.options = options;
      var compiled = $compile('<div chromaos-options-menu-menu=\'options\'></div>')(newScope, function(a, b) {
        defer.resolve(a[0]);
      });
      return defer.promise;
    };
    // this.render = function() {
    //   var defer = $q.defer();
    //   defer.resolve($templateCache.get('modules/chromaos-options-menu/scripts/views/ChromaOSOptionsMenuMenuDirectiveTemplate.html'));
    //   return defer.promise;
    // };

    this.removeMenus = function() {
      $('.chromaos-options-menu').parent().remove();
    };

    this.$close = function(element) {
      self.removeMenus();
      $(element).removeClass(openedClass);
      opened = false;
    };

    this.$open = function(element, options) {
      self.render(options).then(function(result) {
        $(element).addClass(openedClass);
        $(element).append(result);
        opened = true;
      });
    };

    this.$toggle = function(element, options) {
      if ($(element).hasClass(openedClass)) {
        self.$close(element);
      } else {
        self.$open(element, options);
      }
    };

    this.isOpened = function() {
      return opened;
    };

    var factory = {
      $toggle: this.$toggle,
      $open: this.$open,
      $close: this.$close,
      removeMenus: this.removeMenus,
      isOpened: this.isOpened
    };

    return factory;
  }

  angular.module('ChromaOS.Services')

  .factory('ChromaOSOptionsMenuService', ChromaOSOptionsMenuService);

  ChromaOSOptionsMenuService.$inject = ['$', '$q', '$http', '$compile', '$templateCache', '$rootScope'];
})(window.angular);
