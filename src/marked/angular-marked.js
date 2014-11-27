/*
 * angular-marked
 * https://github.com/Hypercubed/angular-marked
 * (c) 2014 J. Harshbarger
 * Licensed MIT
 */

/* jshint undef: true, unused: true */
/* global angular:true */

(function () {
	'use strict';

  angular.module('flipMD.marked', [])

  .provider('marked', function () {

    var self = this;

    self.setOptions = function(opts) {  // Store options for later
      this.defaults = opts;
    };

    self.$get = ['$window',function ($window) {
      var m = $window.marked;

      self.setOptions = m.setOptions;
      m.setOptions(self.defaults);

      return m;
    }];

  })

  
  .directive('marked', ['marked', function (marked) {
    return {
      restrict: 'AE',
      replace: true,
      scope: {
        opts: '=',
        marked: '='
      },
      link: function (scope, element, attrs) {
        set(scope.marked || element.text() || '');
	element[0].className += ' markdown';

        function set(val) {
          element.html(marked(val || '', scope.opts || null));
        }

        if (attrs.marked) {
          scope.$watch('marked', set);
        }

      }
    };
  }]);

}());
