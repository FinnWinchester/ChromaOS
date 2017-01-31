(function(angular) {
  'use strict';

  function ChromaOSWindowPanelDirective($rootScope, $, $timeout, ChromaOSAppsService, ChromaOSRelocationService, ChromaOSResponsivenessService, ChromaOSContextualMenuService) {

    var ChromaOSWindowPanelClass = '.chromaos-window-panel';

    function ChromaOSWindowPanelDirectiveLink($scope, $element, $attrs, $controller) {
      var originalTitle = $scope.windowTitle;
      var originalIcon = $scope.windowIcon;
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
            $scope.windowTitle = $scope.windowTitle + ' - ' + args.title;
          } else if (args.reset) {
            $scope.windowTitle = originalTitle;
          } else {
            $scope.windowTitle = args.title;
          }
        }, 0);
      });

      $scope.$on('chromaos.app.reicon', function(e, args) {
        $timeout(function() {
          console.log(args);
          if (args.reset) {
            $scope.windowIcon = originalIcon;
          } else {
            $scope.windowIcon = args.icon;
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
        $scope.windowTitle = newTitle;
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
        windowTitle: '@',
        windowIcon: '@',
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
