angular.module('myapp', ['ChromaOS'])

.controller('ChromaOSController', ['$scope', 'ChromaOSAppsService', function($scope, ChromaOSAppsService) {
  $scope.contextualMenu = {
    menus: [
      [{
        icon: ChromaOSAppsService.findApp('test-app').icon,
        title: ChromaOSAppsService.findApp('test-app').name,
        action: function() {
          ChromaOSAppsService.openApp(ChromaOSAppsService.findApp('test-app'));
        }
      }, {
        icon: ChromaOSAppsService.findApp('shopping-app').icon,
        title: ChromaOSAppsService.findApp('shopping-app').name,
        action: function() {
          ChromaOSAppsService.openApp(ChromaOSAppsService.findApp('shopping-app'));
        }
      }],
      [{
        icon: 'fa fa-times',
        title: 'Close'
      }]
    ]
  };

}])

.constant('moment', moment);
