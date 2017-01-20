(function(angular) {
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
