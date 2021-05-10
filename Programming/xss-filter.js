const matchHtmlRegExp = /["'&<>]/;

/**
 * 对html进行转移
 * @param {string} htmlStr
 */
function escapeHTML(htmlStr) {
  var newStr = htmlStr + '';
  var match = matchHtmlRegExp.exec(newStr);
  if (!match) return newStr;

  var html = newStr.substr(0, match.index);

  for (let i = match.index; i < newStr.length; i++) {
    let escape = '';
    switch (newStr.charCodeAt(i)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        escape = newStr[i];
    }

    html += escape;
  }

  return html;
}

console.log(escapeHTML('"ab<cd>'));
