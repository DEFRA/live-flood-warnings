#!/usr/bin/env node

/*eslint-disable no-multi-str */
var exec = require('child_process').exec
var content = '\
<div id="content" class="wrapper">\
\r\t\t{{> beforeContent }}\
\r\t\t\t{{{content}}}\
\r\t\t{{> afterContent }}\
</div>'

var cmd = "sed -i \
-e 's${{{ content }}}$" + content + "$g' \
-e 's${{{ topOfPage }}}${{> topOfPage }}$g' \
-e 's${{{ head }}}${{> head }}$g' \
-e 's${{{ bodyStart }}}${{> bodyStart }}$g' \
-e 's${{{ cookieMessage }}}${{> cookieMessage }}$g' \
-e 's${{{ insideHeader }}}${{> insideHeader }}$g' \
-e 's${{{ propositionHeader }}}${{> propositionHeader }}$g' \
-e 's${{{ afterHeader }}}${{> afterHeader }}$g' \
-e 's${{{ footerTop }}}${{> footerTop }}$g' \
-e 's${{{ footerSupportLinks }}}${{> footerSupportLinks }}$g' \
-e 's${{{ licenceMessage }}}${{> licenceMessage }}$g' \
-e 's${{{ bodyEnd }}}${{> bodyEnd }}$g' \
views/layout.html"

exec(cmd, function (err) {
  if (err) {
    throw err
  }
})
