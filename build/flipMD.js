(function() {
  angular.module('flipMD', ['flipMD.marked']);

}).call(this);

(function() {
  angular.module('flipMD', ['flipMD.marked', 'flipMD.mdEdit']);

}).call(this);

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

(function() {
  angular.module('flipMD.mdEdit', []).directive('mdEdit', function() {
    return {
      scope: {
        md: '=ngModel'
      },
      controller: 'mdEditCtrl',
      templateUrl: 'mdEdit/mdEdit.html',
      link: function(scope, element, attrs) {
        return scope.textArea = element.find("textarea")[0];
      }
    };
  }).controller('mdEditCtrl', ["$scope", "$timeout", function($scope, $timeout) {
    var s;
    s = $scope;
    s.preview = false;
    s.hasSelection = function() {
      if (s.textArea.selectionStart === s.textArea.textLength) {
        return false;
      }
      return true;
    };
    s.getSelection = function() {
      return {
        start: s.textArea.selectionStart,
        end: s.textArea.selectionEnd,
        text: s.textArea.value.substring(s.textArea.selectionStart, s.textArea.selectionEnd)
      };
    };
    s.setSelection = function(left, length) {
      s.textArea.focus();
      s.textArea.selectionStart = left;
      return s.textArea.selectionEnd = left + length;
    };
    s.insertPlaceholder = function(text, padLeft, padRight) {
      var left, length;
      left = s.md.length + padLeft;
      s.md += text;
      length = text.length - padLeft - padRight;
      return $timeout(function() {
        return s.setSelection(left, length);
      });
    };
    s.insertTextOld = function(text, start, end) {
      var leftText, rightText;
      leftText = s.md.substring(0, start);
      rightText = s.md.substring(end);
      s.md = leftText + text + rightText;
      return s.textArea.focus();
    };
    s.insertText = function(text, selStart, selEnd, padStart, padEnd) {
      var leftText, rightText;
      leftText = s.md.substring(0, selStart);
      rightText = s.md.substring(selEnd);
      s.md = leftText + text + rightText;
      return $timeout(function() {
        return s.setSelection(selStart + padStart, text.length - padStart - padEnd);
      });
    };
    s.onPreview = function() {
      s.preview = !s.preview;
      return console.log(s.preview);
    };
    return s.onEditor = function(param) {
      var aUrl, iUrl, sel, val;
      sel = s.getSelection();
      switch (param) {
        case "bold":
          val = sel.text.length ? sel.text : 'bold';
          return s.insertText("**" + val + "**", sel.start, sel.end, 2, 2);
        case "italic":
          val = sel.text.length ? sel.text : 'italic';
          return s.insertText("_" + val + "_", sel.start, sel.end, 1, 1);
        case "underline":
          val = sel.text.length ? sel.text : 'underline';
          return s.insertText("<u>" + val + "</u>", sel.start, sel.end, 3, 4);
        case "list":
          return s.insertText("\n- Item", s.md.length, s.md.length, 3, 0);
        case "list-2":
          return s.insertText("\n1. Item", s.md.length, s.md.length, 4, 0);
        case "header":
          return s.insertText("\n\n# Header\n\n", sel.end, sel.end, 4, 2);
        case "url":
          iUrl = prompt("Enter URL here:");
          if (iUrl === "") {
            iUrl = "http://codedaily.vn";
          }
          s.md += "\n";
          aUrl = "[text](" + iUrl + ")";
          return s.insertPlaceholder(aUrl, 1, iUrl.length + 3);
        case "img":
          iUrl = prompt("Enter image URL here:");
          if (iUrl === "") {
            iUrl = "http://codedaily.vn";
          }
          s.md += "\n";
          aUrl = "![image text](" + iUrl + ")";
          return s.insertPlaceholder(aUrl, 2, iUrl.length + 3);
        case "code":
          if (sel.text.length) {
            return s.insertText("`" + sel.text + "`", sel.start, sel.end, 1, 1);
          } else {
            return s.insertText("\n```\ncode here\n```", s.md.length, s.md.length, 5, 3);
          }
          break;
        case "hline":
          return s.insertText("\n\n---\n\n", sel.end, sel.end, 7, 0);
        case "quote":
          if (s.hasSelection()) {
            return s.insertTextOld("> " + sel.text, sel.start, sel.end);
          } else {
            return s.insertPlaceholder("> quote", 2, 0);
          }
          break;
        case "strikethrough":
          val = sel.text.length ? sel.text : 'strikethrough';
          return s.insertText("~~" + val + "~~", sel.start, sel.end, 2, 2);
      }
    };
  }]).run(["$templateCache", function($templateCache) {
    return $templateCache.put('mdEdit/mdEdit.html', "<div class=\"panel panel-default\">\n  <div class=\"panel-heading clearfix\">\n    <div class=\"pull-left\" ng-show=\"!preview\">\n      <button class=\"btn btn-default btn-xs fa fa-bold\" ng-click=\"onEditor('bold')\"></button>\n      <button class=\"btn btn-default btn-xs fa fa-italic\" ng-click=\"onEditor('italic')\"></button>\n      <button class=\"btn btn-default btn-xs fa fa-underline\" ng-click=\"onEditor('underline')\"></button>\n      <button class=\"btn btn-default btn-xs fa fa-minus\" ng-click=\"onEditor('hline')\"></button>\n      <button class=\"btn btn-default btn-xs fa fa-list-ul\" ng-click=\"onEditor('list')\"></button>\n      <button class=\"btn btn-default btn-xs fa fa-list-ol\" ng-click=\"onEditor('list-2')\"></button>\n      <button class=\"btn btn-default btn-xs fa fa-header\" ng-click=\"onEditor('header')\"></button>\n      <button class=\"btn btn-default btn-xs fa fa-paperclip\" ng-click=\"onEditor('url')\"></button>\n      <button class=\"btn btn-default btn-xs fa fa-image\" ng-click=\"onEditor('img')\"></button>\n      <button class=\"btn btn-default btn-xs fa fa-code\" ng-click=\"onEditor('code')\"></button>\n      <button class=\"btn btn-default btn-xs fa fa-quote-left\" ng-click=\"onEditor('quote')\"></button>\n      <button class=\"btn btn-default btn-xs fa fa-strikethrough\" ng-click=\"onEditor('strikethrough')\"></button>\n    </div>\n    <div class=\"pull-right\">\n      <button class=\"btn btn-default btn-xs fa fa-eye\" ng-click=\"onPreview()\" ng-class=\"{active: preview}\"></button>\n    </div>\n  </div>\n  <div class=\"panel-body\" style=\"padding: 2px;\" ng-show=\"!preview\">\n    <textarea id=\"mdEditArea\" class=\"form-control\" rows=\"20\" style=\"font-family: 'Andale Mono', 'Lucida Typewriter', monospace; font-size: small\" ng-model=\"md\" ng-trim=\"false\"></textarea>\n  </div>\n  <div class=\"panel-body\" ng-show=\"preview\">\n    <div marked=\"md\"></div>\n  </div>\n</div>");
  }]);

}).call(this);
