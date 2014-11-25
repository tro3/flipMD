angular.module('flipMD.mdEdit', [
  'ui.bootstrap'
])

.directive('mdEdit', () ->
  scope:
    md: '=ngModel'
  controller: 'mdEditCtrl'
  templateUrl: 'mdEdit/mdEdit.html'
  link: (scope, element, attrs) ->
    scope.textArea = element.find("textarea")[0]
)

.controller('mdEditCtrl', ($scope, $timeout) ->

  s = $scope
  s.preview = false


  # Actions

  s.hasSelection = () ->
    if s.textArea.selectionStart == s.textArea.textLength
      return false
    return true

  s.getSelection = () ->
    return {
      start: s.textArea.selectionStart
      end: s.textArea.selectionEnd
      text: s.textArea.value.substring(s.textArea.selectionStart, s.textArea.selectionEnd)
    }

  s.setSelection = (left, length) ->
    s.textArea.focus()
    s.textArea.selectionStart = left
    s.textArea.selectionEnd = left + length

  s.insertPlaceholder = (text, padLeft, padRight) ->
    left = s.md.length + padLeft
    s.md += text
    length = text.length - padLeft - padRight
    $timeout( () ->
      s.setSelection(left, length)
    )

  s.insertTextOld = (text, start, end) ->
    leftText = s.md.substring(0, start)
    rightText = s.md.substring(end)
    s.md = leftText + text + rightText
    s.textArea.focus()
    
  s.insertText = (text, selStart, selEnd, padStart, padEnd) ->
    leftText = s.md.substring(0, selStart)
    rightText = s.md.substring(selEnd)
    s.md = leftText + text + rightText
    $timeout( () ->
      s.setSelection(
        selStart + padStart,
        text.length - padStart - padEnd
      )
    )
    



  # Button Handlers
  
  s.onPreview = () ->
    s.preview = not s.preview
    console.log(s.preview)

  s.onEditor = (param) ->
    sel = s.getSelection()
    switch(param)
      when "bold"
        val = if sel.text.length then sel.text else 'bold'
        s.insertText("**#{val}**", sel.start, sel.end, 2, 2)
      when "italic"
        val = if sel.text.length then sel.text else 'italic'
        s.insertText("_#{val}_", sel.start, sel.end, 1, 1)
      when "underline"
        val = if sel.text.length then sel.text else 'underline'
        s.insertText("<u>#{val}</u>", sel.start, sel.end, 3, 4)
      when "list"
        s.insertText("\n- Item", s.md.length, s.md.length, 3, 0)
      when "list-2"
        s.insertText("\n1. Item", s.md.length, s.md.length, 4, 0)
      when "header"
        s.insertText("\n\n# Header\n\n", sel.end, sel.end, 4, 2)
      when "url"
        iUrl = prompt("Enter URL here:")
        if iUrl == ""
          iUrl = "http://codedaily.vn"
        s.md += "\n"
        aUrl = "[text](" + iUrl + ")"
        s.insertPlaceholder(aUrl, 1, iUrl.length + 3 )
      when "img"
        iUrl = prompt("Enter image URL here:")
        if iUrl == ""
          iUrl = "http://codedaily.vn"
        s.md += "\n"
        aUrl = "![image text](" + iUrl + ")"
        s.insertPlaceholder(aUrl, 2, iUrl.length + 3 )
      when "code"
        if sel.text.length
          s.insertText("`#{sel.text}`", sel.start, sel.end, 1, 1)
        else
          s.insertText("\n```\ncode here\n```", s.md.length, s.md.length, 5, 3)
      when "hline"
        s.insertText("\n\n---\n\n", sel.end, sel.end, 7, 0)
      when "quote"
        if s.hasSelection()
          s.insertTextOld("> " + sel.text, sel.start, sel.end)
        else
          s.insertPlaceholder("> quote", 2, 0)
      when "strikethrough"
        val = if sel.text.length then sel.text else 'strikethrough'
        s.insertText("~~#{val}~~", sel.start, sel.end, 2, 2)

)


.run(($templateCache) ->
  $templateCache.put('mdEdit/mdEdit.html', """
    <div class="panel panel-default">
      <div class="panel-heading clearfix">
        <div class="pull-left" ng-show="!preview">
          <button class="btn btn-default btn-xs fa fa-bold"          ng-click="onEditor('bold')"          tooltip="Bold"></button>
          <button class="btn btn-default btn-xs fa fa-italic"        ng-click="onEditor('italic')"        tooltip="Italic"></button>
          <button class="btn btn-default btn-xs fa fa-underline"     ng-click="onEditor('underline')"     tooltip="Underline"></button>
          <button class="btn btn-default btn-xs fa fa-minus"         ng-click="onEditor('hline')"         tooltip="Horizontal Line"></button>
          <button class="btn btn-default btn-xs fa fa-list-ul"       ng-click="onEditor('list')"          tooltip="Bullet List"></button>
          <button class="btn btn-default btn-xs fa fa-list-ol"       ng-click="onEditor('list-2')"        tooltip="Numbered List"></button>
          <button class="btn btn-default btn-xs fa fa-header"        ng-click="onEditor('header')"        tooltip="Header"></button>
          <button class="btn btn-default btn-xs fa fa-paperclip"     ng-click="onEditor('url')"           tooltip="Link"></button>
          <button class="btn btn-default btn-xs fa fa-image"         ng-click="onEditor('img')"           tooltip="Image"></button>
          <button class="btn btn-default btn-xs fa fa-code"          ng-click="onEditor('code')"          tooltip="Code"></button>
          <button class="btn btn-default btn-xs fa fa-quote-left"    ng-click="onEditor('quote')"         tooltip="Quote"></button>
          <button class="btn btn-default btn-xs fa fa-strikethrough" ng-click="onEditor('strikethrough')" tooltip="Strikethrough"></button>
        </div>
        <div class="pull-right">
          <button class="btn btn-default btn-xs fa fa-eye" ng-click="onPreview()" ng-class="{active: preview}" tooltip="Preview"></button>
        </div>
      </div>
      <div class="panel-body" style="padding: 2px;" ng-show="!preview">
        <textarea id="mdEditArea" class="form-control" rows="20" style="font-family: 'Andale Mono', 'Lucida Typewriter', monospace; font-size: small" ng-model="md" ng-trim="false"></textarea>
      </div>
      <div class="panel-body" ng-show="preview">
        <div marked="md"></div>
      </div>
    </div>
"""
  )
)
