(function(angular) {
  'use strict';

  function ChromaOSAppsService($compile, $rootScope, $) {

    var appWindowPanelWrapper = '<div chromaos-window-panel tpl="__app_tpl__" title="__app_title__" app-id="__app_id__" app-icon="__app_icon__"></div>';
    var openedApps = [];
    var registeredApps = [];
    var defaultAppendTo = '.chromaos-desktop';

    var get = function() {
      return registeredApps;
    };

    var prepareApp = function(app, appId) {
      var prepared = appWindowPanelWrapper
        .replace('__app_title__', app.name)
        .replace('__app_id__', appId)
        .replace('__app_tpl__', app.template)
        .replace('__app_icon__', app.icon);
      return prepared;
    };

    var getOpenedApps = function() {
      return openedApps;
    };

    var findApp = function(id) {
      var index = get().findIndex(function(each) {
        return each.id === id;
      });
      return index !== -1 ? get()[index] : false;
    };

    var findOpenedAppIndex = function(id) {
      var index = getOpenedApps().findIndex(function(each) {
        return each.appId === id;
      });
      return index;
    };

    var findOpenedApp = function(id) {
      var index = findOpenedAppIndex(id);
      return index !== -1 ? getOpenedApps()[index] : false;
    };

    var openApp = function(app, focused, args) {
      var newScope = $rootScope.$new(true);
      var appId = 'app-' + (Math.floor(Math.random() * 90000) + 10000);
      var renderedApp = $compile(prepareApp(app, appId))(newScope, function(a, b, c) {
        setTimeout(function() {
          var renderedHtml = $(a[0]);
          if (focused) {
            renderedHtml.addClass('chromaos-window-panel-wrapper-focus-on-open');
          }
          getOpenedApps().push({
            id: app.id,
            appId: appId,
            scope: newScope,
            args: args
          });
          var appendTo = (app.config && app.config.appendTo ? app.config.appendTo : defaultAppendTo);
          $(appendTo).append(a[0]);
          var finalArgs = {
            html: a[0],
            appId: appId,
            appendTo: appendTo,
            focused: focused,
            config: app.config
          };
          if (args) {
            angular.extend(finalArgs, args);
          }
          newScope.$broadcast('chromaos.window.opened', finalArgs);
          newScope.$apply();
        }, 0);
      });
    };

    var closeApp = function(app, scope) {
      app.scope.$destroy();
      scope.$destroy();
      var index = findOpenedAppIndex(scope.appId);
      openedApps.splice(index, 1);
      $(defaultAppendTo).find('[data-app-id="' + scope.appId + '"]').parent().remove();
    };

    var focusLastApp = function() {
      var app = openedApps[openedApps.length - 1];
      if (app) {
        $rootScope.$broadcast('chromaos.specific-app.focus', {
          appId: app.appId
        });
      } else {
        $rootScope.$broadcast('chromaos.desktop.focus', {});
      }
    };

    var focusApp = function() {

    };

    var unfocusAll = function() {

    };

    var register = function(app) {
      registeredApps.push(app);
      if (app.config.autostart) {
        openApp(app, app.config.focused, app.args);
      }
    };

    $rootScope.$on('chromaos.app.open', function(e, args) {
      $(args.appendTo).append(args.html);
    });

    var newScope = function() {
      return $rootScope.$new();
    };

    var factory = {
      get: get,
      register: register,
      openApp: openApp,
      getOpenedApps: getOpenedApps,
      closeApp: closeApp,
      findApp: findApp,
      findOpenedApp: findOpenedApp,
      findOpenedAppIndex: findOpenedAppIndex,
      newScope: newScope,
      focusLastApp: focusLastApp
    };

    return factory;
  }

  angular.module('ChromaOS.Services')

  .factory('ChromaOSAppsService', ChromaOSAppsService);

  ChromaOSAppsService.$inject = ['$compile', '$rootScope', '$'];
})(window.angular);
