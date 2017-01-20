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
;(function(angular) {
  'use strict';

  angular.module('ChromaOS.Services', []);

})(window.angular);
;(function(angular) {
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
;(function(angular) {
  'use strict';

  function ChromaOSRelocationService($) {

		function relocate(element, config) {

			var starterConfig = {
				top: 'auto',
				left: 'auto',
				right: 'auto',
				bottom: 'auto'
			};

			var defaultTop = 5,
				calculatedTop = ($(window).height() / 2 - element.height() / 2),
				defaultLeft = 5,
				calculatedLeft = ($(window).width() / 2 - element.width() / 2),
				defaultRight = 5,
				defaultBottom = 5;

			if (config.startAt) {
				switch (config.startAt) {
					case 1:
						starterConfig.top = defaultTop;
						starterConfig.left = defaultLeft;
						break;
					case 2:
						starterConfig.top = defaultTop;
						starterConfig.left = calculatedLeft;
						break;
					case 3:
						starterConfig.top = defaultTop;
						starterConfig.right = defaultRight;
						break;
					case 4:
						starterConfig.top = calculatedTop;
						starterConfig.left = defaultLeft;
						break;
					case 5:
						starterConfig.top = calculatedTop;
						starterConfig.left = calculatedLeft;
						break;
					case 6:
						starterConfig.top = calculatedTop;
						starterConfig.right = defaultRight;
						break;
					case 7:
						starterConfig.bottom = defaultBottom;
						starterConfig.left = defaultLeft;
						break;
					case 8:
						starterConfig.bottom = defaultBottom;
						starterConfig.left = calculatedLeft;
						break;
					case 9:
						starterConfig.bottom = defaultBottom;
						starterConfig.right = defaultRight;
						break;
					default:
						starterConfig.top = defaultTop;
						starterConfig.left = defaultLeft;
						break;
				}
			}

			element.css('top', starterConfig.top);
			element.css('left', starterConfig.left);
			element.css('right', starterConfig.right);
			element.css('bottom', starterConfig.bottom);
		}

    var factory = {
      relocate: relocate
    };

    return factory;
  }

  angular.module('ChromaOS.Services')

  .factory('ChromaOSRelocationService', ChromaOSRelocationService);

  ChromaOSRelocationService.$inject = ['$'];
})(window.angular);
;(function(angular) {
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
;(function(angular) {
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
;(function(angular) {
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
;(function(angular) {
  'use strict';

  angular.module('ChromaOS.Modules', [
		'ChromaOS.Modules.ContextualMenu',
		'ChromaOS.Modules.OptionsMenu',
		'ChromaOS.Modules.WindowPanel'
	]);

})(window.angular);
;(function(angular) {
  'use strict';

  angular.module('ChromaOS.Modules.ContextualMenu', []);

})(window.angular);
;(function(angular) {
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
;(function(angular) {
  'use strict';

  angular.module('ChromaOS.Modules.OptionsMenu', []);

})(window.angular);
;(function(angular) {
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
;(function(angular) {
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
;(function(angular) {
  'use strict';

  angular.module('ChromaOS.Modules.WindowPanel', []);

})(window.angular);
;(function(angular) {
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
;(function(angular) {
  'use strict';

  function ChromaOSWindowPanelDirective($rootScope, $, $timeout, ChromaOSAppsService, ChromaOSRelocationService, ChromaOSResponsivenessService, ChromaOSContextualMenuService) {

    var ChromaOSWindowPanelClass = '.chromaos-window-panel';

    function ChromaOSWindowPanelDirectiveLink($scope, $element, $attrs, $controller) {
      var originalTitle = $scope.title;
      var ChromaOSWindowPanelElement = $($element).find(ChromaOSWindowPanelClass);
      var defaultWidth = '400px';
      var defaultHeight = '400px';
      var getWindowFinalWidth = function(args) {
        return (angular.isDefined(args.config) && angular.isDefined(args.config.size) && angular.isDefined(args.config.size.width) ? args.config.size.width : defaultWidth);
      };

      var getWindowFinalHeight = function(args) {
        return (angular.isDefined(args.config) && angular.isDefined(args.config.size) && angular.isDefined(args.config.size.height) ? args.config.size.height : defaultHeight);
      };

      // Focus window.
      $scope.focus = function() {
        $controller.focus();
      };

      // Close window.
      $scope.close = function() {
        $controller.close();
      };

      // Collapse content.
      $scope.collapse = function() {
        $controller.collapse();
      };

      // Expand content.
      $scope.expand = function() {
        $controller.expand();
      };

      // Toggle collapsed status.
      $scope.toggleCollapsed = function() {
        $controller.toggleCollapsed();
      };

      // Send to bottom.
      $scope.minimize = function() {
        $controller.minimize();
      };

      // Restore from bottom.
      $scope.restore = function() {
        $controller.restore();
      };

      // Toggle minimized status
      $scope.toggleMinimized = function() {
        $controller.toggleMinimized();
      };

      // Make it full wcreen.
      $scope.makeFullScreen = function() {
        $controller.makeFullScreen();
      };

      // Make it windowed.
      $scope.makeWindowed = function() {
        $controller.makeWindowed();
      };

      // Toggle fullscreen.
      $scope.toggleFullScreen = function() {
        $controller.toggleFullScreen();
      };

      // Toggle halfscreen.
      $scope.toggleHalfScreen = function(position) {
        $controller.toggleHalfScreen(position);
      };

      $scope.$on('chromaos.window.opened', function(e, args) {
        ChromaOSWindowPanelElement.css('width', getWindowFinalWidth(args));
        ChromaOSWindowPanelElement.css('height', getWindowFinalHeight(args));
        $controller.focus();
        $controller.setConfig(args.config);
        $controller.$init();
      });

      $scope.$on('chromaos.window.fire.full-screen', function(e, args) {
        $scope.makeFullScreen();
      });

      $scope.$on('chromaos.window.fire.restore', function(e, args) {
        $scope.restore();
      });

      $scope.$on('chromaos.window.fire.minimize', function(e, args) {
        $scope.minimize();
      });

      $scope.$on('chromaos.window.fire.windowed', function(e, args) {
        $scope.makeWindowed();
      });

      $scope.$on('chromaos.window.fire.collapse', function(e, args) {
        $scope.collapse();
      });

      $scope.$on('chromaos.window.fire.expand', function(e, args) {
        $scope.expand();
      });

      $rootScope.$on('chromaos.specific-app.focus', function(e, args) {
        if ($scope.appId === args.appId) {
          $controller.focus();
        }
      });

      // Change app window's title.
      $scope.retitle = function(newTitle) {
        $controller.retitle(newTitle);
      };

      $scope.$on('chromaos.app.retitle', function(e, args) {
        $timeout(function() {
          if (args.append) {
            $scope.title = $scope.title + ' - ' + args.title;
          } else if (args.reset) {
            $scope.title = originalTitle;
          } else {
            $scope.title = args.title;
          }
        }, 0);
      });

      $scope.$on('chromaos.app.resize', function(e, args) {
        var animateSettings = {
          height: '+' + (args.size.height) + '',
          width: '+' + (args.size.width) + ''
        };

        var animationConfig = {
          duration: args.duration || 200,
          easing: 'easeOutQuart'
        };
        ChromaOSWindowPanelElement.css('position', 'absolute !important');
        ChromaOSWindowPanelElement.animate(animateSettings, animationConfig);
      });

      // Force focus.
      $scope.$on('chromaos.app.focus', function(e, args) {
        $scope.focus();
      });

      // Force close.
      $scope.$on('chromaos.app.close', function(e, args) {
        $scope.close();
      });

      $scope.dirty = {
        is_dirty: false,
        message: false
      };
      $scope.$on('chromaos.window.dirty.make_dirty', function(e, args) {
        $scope.dirty.is_dirty = args.dirty;
      });
      $scope.$on('chromaos.window.dirty.change_message', function(e, args) {
        $scope.dirty.message = args.message;
      });

      $scope.$on('chromaos.window.header.border', function(e, args) {
        $controller.setBorderless(args.borderless);
      });

      $scope.isBorderless = function() {
        return $controller.isBorderless();
      };

    }

    function ChromaOSWindowPanelDirectiveController($scope, $element) {

      var self = this;
      var ChromaOSWindowPanelElement = $($element).find('.chromaos-window-panel');
      this.appConfig = {};

      this.setConfig = function(appConfig) {
        if (angular.isUndefined(appConfig)) {
          this.appConfig = {};
        } else {
          this.appConfig = appConfig;
        }
      };

      this.behaviorExists = function() {
        return this.appConfig.behavior;
      };

      this.isResizable = function() {
        return (!this.behaviorExists() || this.behaviorExists().resizable || this.behaviorExists().resizable);
      };

      this.isDraggable = function() {
        return (!this.behaviorExists() || this.behaviorExists().draggable || this.behaviorExists().draggable);
      };

      this.isFullScreenable = function() {
        return (!this.behaviorExists() || this.behaviorExists().fullScreenable || this.behaviorExists().fullScreenable);
      };

      this.isCollapsable = function() {
        return (!this.behaviorExists() || this.behaviorExists().collapsable || this.behaviorExists().collapsable);
      };

      this.isMinimizable = function() {
        return (!this.behaviorExists() || this.behaviorExists().minimizable || this.behaviorExists().minimizable);
      };

      this.isCloseable = function() {
        return (!this.behaviorExists() || this.behaviorExists().closeable || this.behaviorExists().closeable);
      };

      this.isBorderless = function() {
        return this.appConfig.borderless;
      };

      this.setBorderless = function(borderless) {
        this.appConfig.borderless = borderless;
      };

      $scope.chromaosContextualMenuConfig = {
        menus: [
          [{
            icon: 'fa fa-compress',
            title: 'Collapse',
            action: function() {
              $scope.toggleCollapsed();
            }
          }, {
            icon: 'fa fa-minus',
            title: 'Minimize',
            action: function() {
              $scope.toggleMinimized();
            }
          }, {
            icon: 'fa fa-window-maximize',
            title: 'Full screen',
            action: function() {
              $scope.toggleFullScreen();
            }
          }],
          [{
            icon: 'fa fa-times',
            title: 'Close',
            action: function() {
              $scope.close();
            }
          }]
        ]
      };

      $scope.collapsed = false;
      $scope.fullScreen = false;
      $scope.minimized = false;

      var rebuildWindowPanelConfig = function() {
        $scope.windowPanel = {
          // style: 'mac-like',
          style: 'windows-like',
          options: [{
            id: '1',
            name: '',
            className: 'close',
            icon: 'fa fa-times',
            action: function() {
              $scope.close();
            }
          }, {
            id: '2',
            name: '',
            className: 'toggle-full-screen',
            icon: ($scope.fullScreen ? 'fa fa-window-restore' : 'fa fa-window-maximize'),
            action: function() {
              $scope.toggleFullScreen();
            }
          }, {
            id: '3',
            name: '',
            className: 'toggle-minimized',
            icon: 'fa fa-window-minimize',
            action: function() {
              $scope.toggleMinimized();
            }
          }, {
            id: '4',
            name: '',
            className: 'toggle-collapsed',
            icon: 'fa fa-compress',
            action: function() {
              $scope.toggleCollapsed();
            }
          }]
        };
        $timeout(function() {
          $scope.$apply();
        }, 0);
      };

      rebuildWindowPanelConfig();

      this.rebuildWindowPanelClassesConfig = function() {
        $scope.windowPanelClassesConfig = {
          'collapsed': $scope.collapsed,
          'full-screen': $scope.fullScreen,
          'half-screen half-screen-left': $scope.halfScreenLeft,
          'half-screen half-screen-right': $scope.halfScreenRight,
          'minimized': $scope.minimized
        };
        rebuildWindowPanelConfig();
      };

      this.resetWindowPanelClassesConfig = function() {
        $scope.collapsed = false;
        $scope.fullScreen = false;
        $scope.minimized = false;
        this.rebuildWindowPanelClassesConfig();
      };

      this.resetWindowPanelClassesConfig();

      this.close = function() {
        if (this.isCloseable()) {
          var app = ChromaOSAppsService.findOpenedApp($scope.appId);
          if (app) {
            if ($scope.dirty.is_dirty) {
              console.log($scope.dirty);
            } else {
              console.log('not dirty');
              ChromaOSAppsService.closeApp(app, $scope);
              ChromaOSAppsService.focusLastApp();
            }
          }
        }
      };

      this.collapse = function() {
        $scope.collapsed = true;
        this.rebuildWindowPanelClassesConfig();
        this.makeResizable(false);
      };

      this.expand = function() {
        $scope.collapsed = false;
        this.rebuildWindowPanelClassesConfig();
        if (!$scope.fullScreen) {
          this.makeResizable(true);
        }
      };

      this.toggleCollapsed = function() {
        if (this.isCollapsable()) {
          if (!$scope.minimized) {
            if ($scope.collapsed) {
              this.expand();
            } else {
              this.collapse();
            }
          }
        }
      };

      this.minimize = function() {
        $scope.minimized = true;
        $scope.collapsed = false;
        this.rebuildWindowPanelClassesConfig();
        this.makeResizable(false);
      };

      this.restore = function() {
        $scope.minimized = false;
        if (parseInt($($element).css('top')) < 0) {
          ChromaOSWindowPanelElement.css('top', '15px');
        }
        if (parseInt($($element).css('left')) < 0) {
          ChromaOSWindowPanelElement.css('left', '15px');
        }
        this.rebuildWindowPanelClassesConfig();
        if (!$scope.fullScreen) {
          this.makeResizable(true);
        }
      };

      this.toggleMinimized = function() {
        if (this.isMinimizable()) {
          if ($scope.minimized) {
            this.restore();
          } else {
            $scope.collapsed = true;
            $scope.halfScreenLeft = false;
            $scope.halfScreenRight = false;
            this.minimize();
          }
        }
      };

      this.makeFullScreen = function() {
        $scope.fullScreen = true;
        $scope.halfScreenLeft = false;
        $scope.halfScreenRight = false;
        $scope.minimized = false;
        self.rebuildWindowPanelClassesConfig();
        ChromaOSWindowPanelElement.css('top', '5px');
      };

      this.makeWindowed = function() {
        $scope.fullScreen = false;
        $scope.collapsed = false;
        $scope.minimized = false;
        $scope.halfScreenRight = false;
        $scope.halfScreenLeft = false;
        self.rebuildWindowPanelClassesConfig();
        if (parseInt(ChromaOSWindowPanelElement.css('top')) < 0) {
          ChromaOSWindowPanelElement.css('top', '15px');
        }

        if ($scope.wasHalfScreenLeft || $scope.wasHalfScreenRight) {
          ChromaOSWindowPanelElement.css('left', '15px');
          ChromaOSWindowPanelElement.css('top', '15px');
          $scope.wasHalfScreenRight = false;
          $scope.wasHalfScreenLeft = false;
          self.makeResizable(true);
        }

        self.makeDraggable(false);
      };

      this.makeHalfScreen = function(position) {
        if (position === 'left') {
          $scope.halfScreenLeft = true;
          $scope.wasHalfScreenLeft = true;

          $scope.halfScreenRight = false;
          $scope.wasHalfScreenRight = false;
        } else if (position === 'right') {
          $scope.halfScreenLeft = false;
          $scope.wasHalfScreenLeft = false;

          $scope.halfScreenRight = true;
          $scope.wasHalfScreenRight = true;
        }
        self.rebuildWindowPanelClassesConfig();
        // if (parseInt($($element).css('top')) < 0) {
        //   $($element).css('top', '0');
        // }
      };

      var resizableConfig = {
        minWidth: 200,
        minHeight: 200,
        resize: function(e, ui) {
          ChromaOSResponsivenessService.respond(ChromaOSWindowPanelElement);
        }
      };

      this.makeResizable = function(enabled) {
        if (this.isResizable() && enabled) {
          try {
            ChromaOSWindowPanelElement.resizable('enable');
          } catch (e) {
            ChromaOSWindowPanelElement.resizable(resizableConfig);
          }
        } else {
          try {
            ChromaOSWindowPanelElement.resizable('disable');
          } catch (e) {}
        }
      };

      var ChromaOSObjectsContainer = $('.chromaos-desktop');

      var draggableConfig = {
        scroll: false,
        drag: function(e, ui) {
          if ($scope.relocateWindowToCursorCentered) {
            ui.position.top = (e.pageY - (ChromaOSWindowPanelElement.find('.chromaos-window-panel-header').height() / 2) - $('.chromaos-desktop').position().top);
            ui.position.left = (e.clientX - (ChromaOSWindowPanelElement.width() / 2));
          }
        },
        start: function(e, ui) {},
        stop: function(e, ui) {
          self.makeDraggable(false);
          $scope.relocateWindowToCursorCentered = false;
          var offsetPercent = 10;
          if ((e.pageY < ChromaOSObjectsContainer.position().top && e.pageX < $(document).width() * (offsetPercent / 100)) || (e.pageX <= 0)) {
            $scope.toggleHalfScreen('left');
          } else if ((e.pageY < ChromaOSObjectsContainer.position().top && e.pageX > $(document).width() * (1 - offsetPercent / 100)) || ((e.pageX + 2) >= $(window).width())) {
            // -2px because right position will never be exactly the document's width.
            $scope.toggleHalfScreen('right');
          } else if (e.pageY < ChromaOSObjectsContainer.position().top) {
            $scope.toggleFullScreen();
          }
        }
      };

      this.makeDraggable = function(enabled) {
        if (this.isDraggable() && enabled) {
          try {
            ChromaOSWindowPanelElement.draggable('enable');
            if ($scope.fullScreen || $scope.halfScreenLeft || $scope.halfScreenRight) {
              ChromaOSWindowPanelElement.draggable('option', 'start', function(e, ui) {
                if ($scope.fullScreen) {
                  $scope.toggleFullScreen();
                } else if ($scope.halfScreenLeft || $scope.halfScreenRight) {
                  $scope.makeWindowed();
                }
              });
              ChromaOSWindowPanelElement.draggable('option', 'distance', 50);
            } else {
              ChromaOSWindowPanelElement.draggable('option', 'distance', 1);
            }
          } catch (e) {
            ChromaOSWindowPanelElement.draggable(draggableConfig);
          }
        } else {
          try {
            ChromaOSWindowPanelElement.draggable('disable');
          } catch (e) {}
        }
      };

      this.toggleFullScreen = function() {
        if (this.isFullScreenable()) {
          if ($scope.fullScreen) {
            self.makeWindowed();
            self.makeResizable(true);
          } else {
            self.makeFullScreen();
            self.makeResizable(false);
          }
        }
      };

      this.toggleHalfScreen = function(position) {
        if ($scope.halfScreen) {

        } else {
          self.makeHalfScreen(position);
          self.makeResizable(false);
        }
      };

      var removeFocus = function() {
        $(ChromaOSWindowPanelClass + '.focused').removeClass('focused');
      };

      this.focus = function() {
        if (!ChromaOSWindowPanelElement.hasClass('focused')) {
          $(ChromaOSWindowPanelClass + '.focused').removeClass('focused');
          ChromaOSWindowPanelElement.addClass('focused');
          $scope.$broadcast('chromaos.app.focused', {});
        }
      };

      $rootScope.$on('chromaos.desktop.focus', function(e, args) {
        removeFocus();
      });

      this.getScope = function() {
        return $scope;
      };

      this.retitle = function(newTitle) {
        $scope.title = newTitle;
      };

      this.$init = function() {

        ChromaOSWindowPanelElement.on('mousedown', function(e) {
          ChromaOSContextualMenuService.closeContextualMenus();
          self.focus();
        });

        ChromaOSWindowPanelElement.find('.chromaos-window-panel-header-title').on('mousedown', function(e) {
          if ($scope.fullScreen || $scope.wasHalfScreenLeft || $scope.wasHalfScreenRight) {
            $scope.relocateWindowToCursorCentered = true;
          }
          if (e.which === 1) {
            self.makeDraggable(true);
          } else {
            self.makeDraggable(false);
          }
        });

        self.makeResizable(true);

        ChromaOSWindowPanelElement.find('.chromaos-window-panel-header-title').on('dblclick', function(e) {
          ChromaOSWindowPanelElement.find('.chromaos-window-panel-header-actions-' + $scope.windowPanel.style + '-full-screen').click();
        });

        ChromaOSRelocationService.relocate(ChromaOSWindowPanelElement, this.appConfig);

        $timeout(function() {
          if ($element.hasClass('chromaos-window-panel-wrapper-focus-on-open')) {
            self.focus();
            $element.removeClass('chromaos-window-panel-wrapper-focus-on-open');
          }
        }, 0);

        ChromaOSResponsivenessService.respond(ChromaOSWindowPanelElement);

        if (this.appConfig.fullscreen) {
          $scope.makeFullScreen();
        }
      };

    }

    ChromaOSWindowPanelDirectiveController.$inject = ['$scope', '$element'];

    var directive = {
      restrict: 'EA',
      scope: {
        tpl: '@',
        title: '@',
        appIcon: '@',
        appId: '@'
      },
      templateUrl: 'modules/chromaos-window-panel/directives/views/ChromaOSWindowPanelDirectiveTemplate.html',
      link: ChromaOSWindowPanelDirectiveLink,
      controller: ChromaOSWindowPanelDirectiveController
    };

    return directive;
  }

  angular.module('ChromaOS.Modules.WindowPanel')

  .directive('chromaosWindowPanel', ChromaOSWindowPanelDirective);

  ChromaOSWindowPanelDirective.$inject = ['$rootScope', '$', '$timeout', 'ChromaOSAppsService', 'ChromaOSRelocationService', 'ChromaOSResponsivenessService', 'ChromaOSContextualMenuService'];
})(window.angular);
;angular.module('ChromaOS.Templates', ['modules/chromaos-contextual-menu/directives/ChromaOSContextualMenuDirectiveTemplate.html', 'modules/chromaos-options-menu/scripts/views/ChromaOSOptionsMenuButtonDirectiveTemplate.html', 'modules/chromaos-options-menu/scripts/views/ChromaOSOptionsMenuMenuDirectiveTemplate.html', 'modules/chromaos-window-panel/directives/views/ChromaOSWindowPanelCompilerDirectiveTemplate.html', 'modules/chromaos-window-panel/directives/views/ChromaOSWindowPanelDirectiveTemplate.html']);

angular.module("modules/chromaos-contextual-menu/directives/ChromaOSContextualMenuDirectiveTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/chromaos-contextual-menu/directives/ChromaOSContextualMenuDirectiveTemplate.html",
    "<div class=\"chromaos-contextual-menu\">\n" +
    "	<div class=\"chromaos-contextual-menu-header\"></div>\n" +
    "	<ul class=\"chromaos-contextual-menu-list\" ng-repeat=\"menu in chromaosContextualMenu.menus\">\n" +
    "		<li class=\"chromaos-contextual-menu-list-item\" ng-repeat=\"item in menu\" ng-click=\"item.action();\">\n" +
    "			<i class=\"{{item.icon}}\"></i> {{item.title}}\n" +
    "		</li>\n" +
    "	</ul>\n" +
    "	<div class=\"chromaos-contextual-menu-footer\"></div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("modules/chromaos-options-menu/scripts/views/ChromaOSOptionsMenuButtonDirectiveTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/chromaos-options-menu/scripts/views/ChromaOSOptionsMenuButtonDirectiveTemplate.html",
    "<div class=\"chromaos-options-menu-wrapper\">\n" +
    "	<div class=\"chromaos-options-menu-wrapper-button\" ng-click=\"toggleOptionsMenu();\">\n" +
    "		<i class=\"chromaos-options-menu-wrapper-button-icon fa fa-ellipsis-v\"></i>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("modules/chromaos-options-menu/scripts/views/ChromaOSOptionsMenuMenuDirectiveTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/chromaos-options-menu/scripts/views/ChromaOSOptionsMenuMenuDirectiveTemplate.html",
    "<div class=\"chromaos-options-menu\">\n" +
    "	<div class=\"chromaos-options-menu-menu\" ng-repeat=\"menu in chromaosOptionsMenuMenu\">\n" +
    "		<div class=\"chromaos-options-menu-menu-title\" ng-if=\"menu.title\">\n" +
    "			{{menu.title}}\n" +
    "		</div>\n" +
    "		<div class=\"chromaos-options-menu-menu-option\" ng-repeat=\"option in menu.options\" ng-class=\"{'chromaos-options-menu-menu-option-disabled': option.disabled}\" ng-click=\"option.action(option);\">\n" +
    "			{{option.title}}\n" +
    "		</div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("modules/chromaos-window-panel/directives/views/ChromaOSWindowPanelCompilerDirectiveTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/chromaos-window-panel/directives/views/ChromaOSWindowPanelCompilerDirectiveTemplate.html",
    "<div></div>\n" +
    "");
}]);

angular.module("modules/chromaos-window-panel/directives/views/ChromaOSWindowPanelDirectiveTemplate.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("modules/chromaos-window-panel/directives/views/ChromaOSWindowPanelDirectiveTemplate.html",
    "<div class=\"chromaos-window-panel\" data-app-id=\"{{appId}}\" ng-class=\"windowPanelClassesConfig\">\n" +
    "	<div class=\"chromaos-window-panel-header\" chromaos-contextual-menu=\"chromaosContextualMenuConfig\" ng-show=\"!isBorderless();\">\n" +
    "		<div class=\"chromaos-window-panel-header-icon\">\n" +
    "			<i class=\"{{appIcon}} fa-fw\"></i>\n" +
    "		</div>\n" +
    "		<div class=\"chromaos-window-panel-header-title\">\n" +
    "			{{title}}\n" +
    "		</div>\n" +
    "		<div class=\"chromaos-window-panel-header-actions chromaos-window-panel-header-actions-{{windowPanel.style}}\">\n" +
    "			<div ng-repeat=\"windowPanelAction in windowPanel.options\" class=\"chromaos-window-panel-header-actions-{{windowPanel.style}}-action chromaos-window-panel-header-actions-{{windowPanel.style}}-{{windowPanelAction.className}}\" ng-click=\"windowPanelAction.action();\">\n" +
    "				<i class=\"chromaos-window-panel-header-actions-{{windowPanel.style}}-action-icon {{windowPanelAction.icon}}\"></i>\n" +
    "			</div>\n" +
    "		</div>\n" +
    "	</div>\n" +
    "	<div class=\"chromaos-window-panel-content\" ng-class=\"{'borderless': isBorderless()}\" chromaos-contextual-menu>\n" +
    "		<div chromaos-window-panel-compiler tpl=\"tpl\"></div>\n" +
    "	</div>\n" +
    "</div>\n" +
    "");
}]);
;(function(angular) {
  'use strict';

  angular.module('ChromaOS', [
    'ChromaOS.Kernel',
		'ChromaOS.Templates', // Needed when grunting templates (HTML2JS).
		'ChromaOS.Modules',
		'ChromaOS.Services'
	]);

})(window.angular);
