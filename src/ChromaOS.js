(function(angular) {
  'use strict';

  angular.module('ChromaOS', [
    'ChromaOS.Kernel',
		'ChromaOS.Templates', // Needed when grunting templates (HTML2JS).
		'ChromaOS.Modules',
		'ChromaOS.Services'
	]);

})(window.angular);
