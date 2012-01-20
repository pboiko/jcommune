/*
 WYSIWYG-BBCODE editor
 Copyright (c) 2009, Jitbit Sotware, http://www.jitbit.com/
 PROJECT HOME: http://wysiwygbbcode.codeplex.com/
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright
 notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 notice, this list of conditions and the following disclaimer in the
 documentation and/or other materials provided with the distribution.
 * Neither the name of the <organization> nor the
 names of its contributors may be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY Jitbit Software ''AS IS'' AND ANY
 EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL Jitbit Software BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var myeditor, ifm;
var body_id, textboxelement;
var content;
var isIE = /msie|MSIE/.test(navigator.userAgent);
var isChrome = /Chrome/.test(navigator.userAgent);
var isSafari = /Safari/.test(navigator.userAgent) && !isChrome;
var browser = isIE || window.opera;
var textRange;
var enter = 0;
var editorVisible = false;

function BBtag(name, toBBFunction, toHTMLFunction) {
    this.name = name;
    this.toBBFunction = toBBFunction;
    this.toHTMLFunction = toHTMLFunction;
}

function findTag(tagName) {
    for (var i = 0; i < bbtags.length; i++) {
        if (bbtags[i].name == tagName) {
            return bbtags[i];
        }
    }
    return null;
}

var bbtags = [
    new BBtag("b",
        function (htmlToBBText) {
            var convertedText = htmlToBBText;
            convertedText = convertedText.replace(/<\/b>/gi, "[/b]");
            convertedText = convertedText.replace(/<b(\s[^<>]*)?>/gi, "[b]");
            convertedText = convertedText.replace(/<span\s[^<>]*?style="font-weight: bold;"(\s[^<>]*)?>(.*?)<\/span>/gi, "[b]$2[/b]");
            return convertedText;
        }
        ,
        function (bbToHTMLText) {
            var convertedText = bbToHTMLText;
            if (browser) {
                convertedText = convertedText.replace(/\[b\]/gi, "<b>");
                convertedText = convertedText.replace(/\[\/b\]/gi, "</b>");
            } else {
                convertedText = convertedText.replace(/\[b\]/gi, "<span style=\"font-weight: bold;\">");
                convertedText = convertedText.replace(/\[\/b\]/gi, "</span>");
            }
            return convertedText;
        }
    ),
    new BBtag("i",
        function (htmlToBBText) {
            var convertedText = htmlToBBText;
            convertedText = convertedText.replace(/<\/i>/gi, "[/i]");
            convertedText = convertedText.replace(/<i(\s[^<>]*)?>/gi, "[i]");
            convertedText = convertedText.replace(/<span\s[^<>]*?style="font-style: italic;"(\s[^<>]*)?>(.*?)<\/span>/gi, "[i]$2[/i]");
            return convertedText;
        }
        ,
        function (bbToHTMLText) {
            var convertedText = bbToHTMLText;
            if (browser) {
                convertedText = convertedText.replace(/\[i\]/gi, "<i>");
                convertedText = convertedText.replace(/\[\/i\]/gi, "</i>");
            } else {
                convertedText = convertedText.replace(/\[i\]/gi, "<span style=\"font-style: italic;\">");
                convertedText = convertedText.replace(/\[\/i\]/gi, "</span>");
            }
            return convertedText;
        }
    ),
    new BBtag("u",
        function (htmlToBBText) {
            var convertedText = htmlToBBText;
            convertedText = convertedText.replace(/<\/u>/gi, "[/u]");
            convertedText = convertedText.replace(/<u(\s[^<>]*)?>/gi, "[u]");
            convertedText = convertedText.replace(/<span\s[^<>]*?style="text-decoration: underline;"(\s[^<>]*)?>(.*?)<\/span>/gi, "[u]$2[/u]");
            return convertedText;
        }
        ,
        function (bbToHTMLText) {
            var convertedText = bbToHTMLText;
            if (browser) {
                convertedText = convertedText.replace(/\[u\]/gi, "<u>");
                convertedText = convertedText.replace(/\[\/u\]/gi, "</u>");
            } else {
                convertedText = convertedText.replace(/\[u\]/gi, "<span style=\"text-decoration: underline;\">");
                convertedText = convertedText.replace(/\[\/u\]/gi, "</span>");
            }
            return convertedText;
        }
    ),
    new BBtag("s",
        function (htmlToBBText) {
            var convertedText = htmlToBBText;
            convertedText = convertedText.replace(/<span\s[^<>]*?style="text-decoration: line-through;"(\s[^<>]*)?>(.*?)<\/span>/gi, "[s]$2[/s]");
            return convertedText;
        }
        ,
        function (bbToHTMLText) {
            var convertedText = bbToHTMLText;
            convertedText = convertedText.replace(/\[s\]/gi, "<span style=\"text-decoration: line-through;\">");
            convertedText = convertedText.replace(/\[\/s\]/gi, "</span>");
            return convertedText;
        }
    ),
    new BBtag("left",
        function (htmlToBBText) {
            var convertedText = htmlToBBText;
            convertedText = convertedText.replace(/<p\s[^<>]*?class="leftText"([^<>]*)?>(.*?)<\/p>/gi, "[left]$2[/left]");
            return convertedText;
        }
        ,
        function (bbToHTMLText) {
            var convertedText = bbToHTMLText;
            convertedText = convertedText.replace(/\[left\]/gi, '<p class="leftText">');
            convertedText = convertedText.replace(/\[\/left\]/gi, "</p>");
            return convertedText;
        }
    ),
    new BBtag("center",
        function (htmlToBBText) {
            var convertedText = htmlToBBText;
            convertedText = convertedText.replace(/<p\s[^<>]*?class="centerText"([^<>]*)?>(.*?)<\/p>/gi, "[center]$2[/center]");
            return convertedText;
        }
        ,
        function (bbToHTMLText) {
            var convertedText = bbToHTMLText;
            convertedText = convertedText.replace(/\[center\]/gi, '<p class="centerText">');
            convertedText = convertedText.replace(/\[\/center\]/gi, "</p>");
            return convertedText;
        }
    ),
    new BBtag("right",
        function (htmlToBBText) {
            var convertedText = htmlToBBText;
            convertedText = convertedText.replace(/<p\s[^<>]*?class="rightText"([^<>]*)?>(.*?)<\/p>/gi, "[right]$2[/right]");
            return convertedText;
        }
        ,
        function (bbToHTMLText) {
            var convertedText = bbToHTMLText;
            convertedText = convertedText.replace(/\[right\]/gi, '<p class="rightText">');
            convertedText = convertedText.replace(/\[\/right\]/gi, "</p>");
            return convertedText;
        }
    ),
    new BBtag("quote",
        function (htmlToBBText) {
            var convertedText = htmlToBBText;
            convertedText = convertedText.replace(/<div class="quote"><div class="quote_title">Quote:<\/div><blockquote>/gi, "[quote]");
            convertedText = convertedText.replace(/<::after>/gi, "");
            convertedText = convertedText.replace(/<\/div><blockquote>/gi, "");
            convertedText = convertedText.replace(/<\/blockquote><\/div>/gi, "[/quote]");
            convertedText = convertedText.replace(/<div class="quote"><div class="quote_title">([^<>]*?):/gi, "[quote=\"$1\"]");
            return convertedText;
        }
        ,
        function (bbToHTMLText) {
            var convertedText = bbToHTMLText;
            convertedText = convertedText.replace(/\[quote="([^\[\]]*?)"\]/gi, '<div class="quote"><div class="quote_title">$1:</div><blockquote>');
            convertedText = convertedText.replace(/\[quote\]/gi, '<div class="quote"><div class="quote_title">Quote:</div><blockquote>');
            convertedText = convertedText.replace(/\[\/quote\]/gi, "</blockquote></div>");
            return convertedText;
        }
    ),
    new BBtag("code",
        function (htmlToBBText) {
            var convertedText = htmlToBBText;
            convertedText = convertedText.replace(/<div\s[^<>]*?class="code"([^<>]*)?>(.*?)<\/div>/gi, "[code]$2[/code]");
            return convertedText;
        }
        ,
        function (bbToHTMLText) {
            var convertedText = bbToHTMLText;
            convertedText = convertedText.replace(/\[code\]/gi, '<div class="code">');
            convertedText = convertedText.replace(/\[\/code\]/gi, "</div>");
            return convertedText;
        }
    ),
    new BBtag("img",
        function (htmlToBBText) {
            var convertedText = htmlToBBText;
            convertedText = convertedText.replace(/<img\s[^<>]*?src="?([^<>]*?)"?(\s[^<>]*)?\/?>/gi, "[img]$1[/img]");
            return convertedText;
        }
        ,
        function (bbToHTMLText) {
            var convertedText = bbToHTMLText;
            convertedText = convertedText.replace(/\[img\]([^"]*?)\[\/img\]/gi, "<img src=\"$1\" />");
            return convertedText;
        }
    ),
    new BBtag("highlight",
        function (htmlToBBText) {
            var convertedText = htmlToBBText;
            convertedText = convertedText.replace(/<font\s[^<>]*?class="highlight"([^<>]*)?>(.*?)<\/font>/gi, "[highlight]$2[/highlight]");
            return convertedText;
        }
        ,
        function (bbToHTMLText) {
            var convertedText = bbToHTMLText;
            convertedText = convertedText.replace(/\[highlight\]/gi, '<font class="highlight">');
            convertedText = convertedText.replace(/\[\/highlight\]/gi, "</font>");
            return convertedText;
        }
    ),
    new BBtag("list",
        function (htmlToBBText) {
            var convertedText = htmlToBBText;
            convertedText = convertedText.replace(/<\/ul>/gi, "[/list]");
            convertedText = convertedText.replace(/<ul>/gi, "[list]\n");
            convertedText = convertedText.replace(/<li>/gi, "[*]");
            convertedText = convertedText.replace(/<\/li>/gi, "");
            return convertedText;
        }
        ,
        function (bbToHTMLText) {
            var convertedText = bbToHTMLText;
            convertedText = convertedText.replace(/\[list\]\s*\[\*\]/gi, "<ul><li>");
            convertedText = convertedText.replace(/\[\/list\]/gi, "</li></ul>");
            convertedText = convertedText.replace(/\[\*\]/gi, "</li><li>");
            return convertedText;
        }
    ),
    new BBtag("color",
        function (htmlToBBText) {
            var convertedText = htmlToBBText;
            convertedText = convertedText.replace(/<font\s[^<>]*?color="#?([^<>]*?)"?(\s[^<>]*)?>(.*?)<\/font>/gi, "[color=$1]$3[/color]");
            return convertedText;
        }
        ,
        function (bbToHTMLText) {
            var convertedText = bbToHTMLText;
            convertedText = convertedText.replace(/\[color=([^\]]*?)\]([\s\S]*?)\[\/color\]/gi, "<font color=\"$1\">$2</font>");
            return convertedText;
        }
    ),
    new BBtag("size",
        function (htmlToBBText) {
            var convertedText = htmlToBBText;
            convertedText = convertedText.replace(/<font\s[^<>]*?class="textSize(\d*)"[^<>]*?>(.*?)<\/font>/gi, "[size=$1]$2[/size]");
            return convertedText;
        }
        ,
        function (bbToHTMLText) {
            var convertedText = bbToHTMLText;
            convertedText = convertedText.replace(/\[size=([^\]]+)\]([\s\S]*?)\[\/size\]/gi, '<font class="textSize$1">$2</font>');
            return convertedText;
        }
    ),
    new BBtag("indent",
        function (htmlToBBText) {
            var convertedText = htmlToBBText;
            convertedText = convertedText.replace(/<font\s[^<>]*?class="marginLeft(\d*)"[^<>]*?>(.*?)<\/font>/gi, "[indent=$1]$2[/indent]");
            return convertedText;
        }
        ,
        function (bbToHTMLText) {
            var convertedText = bbToHTMLText;
            convertedText = convertedText.replace(/\[indent=([^\]]+)\]([\s\S]*?)\[\/indent\]/gi, '<font class="marginLeft$1">$2</font>');
            return convertedText;
        }
    ),
    new BBtag("url",
        function (htmlToBBText) {
            var convertedText = htmlToBBText;
            convertedText = convertedText.replace(/<a\s[^<>]*?href="?([^<>]*?)"?(\s[^<>]*)?>(.*?)<\/a>/gi, "[url=$1]$3[/url]");
            return convertedText;
        }
        ,
        function (bbToHTMLText) {
            var convertedText = bbToHTMLText;
            convertedText = convertedText.replace(/\[url=([^\]]+)\]([\s\S]*?)\[\/url\]/gi, "<a href=\"$1\">$2</a>");
            convertedText = convertedText.replace(/\[url\]([\s\S]*?)\[\/url\]/gi, "<a href=\"$1\">$1</a>");
            return convertedText;
        }
    ) ];

function rep(re, str) {
    content = content.replace(re, str);
}

function initEditor(textarea_id) {
    body_id = textarea_id;
    textboxelement = document.getElementById(body_id);
    textboxelement.setAttribute('class', 'editorBBCODE');
    textboxelement.className = "editorBBCODE";

    ifm = document.createElement("iframe");
    ifm.setAttribute("id", "rte");
    ifm.setAttribute("class", "editorBBCODE");
    ifm.setAttribute("frameborder", "1");
    ifm.width = '90%';
    ifm.height = 400;
    textboxelement.parentNode.insertBefore(ifm, textboxelement);
    textboxelement.style.display = 'none';

    ifm.style.display = 'none';
    textboxelement.style.display = '';
    editorVisible = false;
}

function ShowEditor() {
    content = document.getElementById(body_id).value;
    myeditor = ifm.contentWindow.document;

    bbcode2html();

    myeditor.open();
    myeditor.write('<html style="background: #f8f8f8;background-image: none;">' +
        '<head><link href="/jcommune/resources/css/screen.css" rel="Stylesheet" type="text/css" /></head>');
    myeditor.write('<body style="height: 100%;width: 100%;margin:0px 0px 0px 0px;background: #f8f8f8;background-image: none;" class="editorWYSIWYG">');
    myeditor.write(content);
    myeditor.write('</body></html>');
    myeditor.close();
}

function doCheck() {
    content = myeditor.body.innerHTML;
    html2bbcode();
    document.getElementById(body_id).value = content;
}

function SwitchEditor() {
    if (editorVisible) {

        doCheck();

        ifm.style.display = 'none';
        textboxelement.style.display = '';
        editorVisible = false;
    }
    else {
        if (ifm) {
            ifm.style.display = '';
            textboxelement.style.display = 'none';
            ShowEditor();
            editorVisible = true;
        }
    }
}

var tagList;

function bbcode2html() {
    rep(/\</gi, "&lt;");
    rep(/\>/gi, "&gt;");

    tagList = [];

    var convertedText = content;
    var reglt = /\[([^\/\[\]]*?)(=[^\[\]]*)?\]/gi;
    var result = reglt.exec(convertedText);
    var i = 0;
    while (result != null) {
        var tag = findTag(result[1]);
        tagList[i] = tag;
        convertedText = tag.toHTMLFunction(convertedText);
        reglt = /\[([^\/\[\]]*?)(=[^\[\]]*)?\]/gi;
        result = reglt.exec(convertedText);
        i++;
    }
    content = convertedText;

    //rep(/\n/gi, "<br\/>");

    document.getElementById(body_id).value = content;
}

function html2bbcode() {
    var convertedText = content;
    for (var i = 0; i < tagList.length; i++) {
        convertedText = tagList[i].toBBFunction(convertedText);
    }
    content = convertedText;

    rep(/&lt;/gi, "<");
    rep(/&gt;/gi, ">");
    rep(/&nbsp;/gi, " ");
    rep(/&quot;/gi, "\"");
    rep(/&amp;/gi, "&");
    //rep(/<br\/>/gi, "\n");
    document.getElementById(body_id).value = content;
}

function closeTags() {
    var currentContent = document.getElementById(body_id).value;
    for (var i = 0; i < bbtags.length; i++) {
        currentContent = closeAllTags(currentContent, bbtags[i].name);
    }
    currentContent = currentContent.replace(/\[size\]/gi, '[size=10]');
    currentContent = currentContent.replace(/\[color\]/gi, '[color=000000]');
    currentContent = currentContent.replace(/\[url\]/gi, '[url=]');
    currentContent = currentContent.replace(/\[indent\]/gi, '[indent=15]');

    content = currentContent;
    document.getElementById(body_id).value = content;
}

function closeAllTags(text, tag) {
    var currentText = text;

    var regPrefix = new RegExp('\\[' + tag + '[^\\[^\\]]*\\]', 'ig');

    var regTags = new RegExp('(\\[' + tag + '[^\\[^\\]]*\\])([\\s\\S]*)(\\[\\/' + tag + '\\])([\\s\\S]*)', 'ig');

    var openTag = new RegExp('\\[' + tag + '(=[^\\[^\\]]*)?\\]', 'ig');
    var closeTag = new RegExp('\\[\\/' + tag + '\\]', 'ig');

    var prefIndex = currentText.search(regPrefix);
    var prefix = "";
    var postfix = "";

    var result = regTags.exec(currentText);
    if (result != null) {
        postfix = closeAllTags(result[4], tag);
        prefix = closeAllTags(currentText.substring(0, prefIndex), tag);
        while (result != null) {
            currentText = result[1] + closeAllTags(result[2], tag) + result[3];
            result = regTags.exec(currentText);
        }
        currentText = prefix + currentText + postfix;
    } else {

        var closeTagResult = closeTag.exec(currentText);
        if (closeTagResult != null) {
            while (closeTagResult != null) {

                var regAbstactTag = /\[[^\[^\]]*\]/gi;

                var intInd = closeTag.lastIndex;
                var tempText = currentText.substring(0, intInd - 3 - tag.length);
                var regAbstactTagRes = regAbstactTag.exec(tempText);
                if (regAbstactTagRes != null) {
                    while (regAbstactTagRes != null) {
                        var regAbstactTagIndex = regAbstactTag.lastIndex;
                        var regAbstactTagRes2 = regAbstactTag.exec(tempText);
                        if (regAbstactTagRes != null && regAbstactTagRes2 == null) {
                            var prefAndTag = tempText.substring(0, regAbstactTagIndex);
                            var cont = tempText.substring(regAbstactTagIndex, intInd - 3 - tag.length);
                            var postText = currentText.substring(intInd - 3 - tag.length, currentText.length);
                            currentText = prefAndTag + "[" + tag + "]" + cont + postText;
                        }
                        regAbstactTagRes = regAbstactTagRes2;
                    }
                } else {
                    currentText = "[" + tag + "]" + currentText;
                }
                closeTagResult = closeTag.exec(currentText);
            }
        } else {
            var openTagResult = openTag.exec(currentText);
            while (openTagResult != null) {
                var regAbstactTag1 = /\[[^\[^\]]*\]/gi;
                var intInd1 = openTag.lastIndex;
                var tempText1 = currentText.substring(intInd1, currentText.length);
                var regAbstactTagRes1 = regAbstactTag1.exec(tempText1);
                if (regAbstactTagRes1 != null) {
                    var regAbstactTagIndex1 = regAbstactTag1.lastIndex;
                    var prefAndTag1 = currentText.substring(0, intInd1 + tempText1.length - regAbstactTagRes1[0].length);
                    var cont1 = tempText1.substring(regAbstactTagIndex1 - regAbstactTagRes1[0].length, tempText1.length);
                    currentText = prefAndTag1 + "[/" + tag + "]" + cont1;

                } else {
                    currentText = currentText + "[/" + tag + "]";
                }
                openTagResult = openTag.exec(currentText);
            }
        }
    }
    return currentText;
}

function doQuote() {
    if (!editorVisible) {
        AddTag('[quote]', '[/quote]');
    }
}

function InsertText(txt) {
    if (!editorVisible)
        textboxelement.value += txt;
}

function doClick(command) {
    if (!editorVisible) {
        switch (command) {
            case 'bold':
                AddTag('[b]', '[/b]');
                break;
            case 'code':
                AddTag('[code]', '[/code]');
                break;
            case 'italic':
                AddTag('[i]', '[/i]');
                break;
            case 'underline':
                AddTag('[u]', '[/u]');
                break;
            case 'line-through':
                AddTag('[s]', '[/s]');
                break;
            case 'highlight':
                AddTag('[highlight]', '[/highlight]');
                break;
            case 'left':
                AddTag('[left]', '[/left]');
                break;
            case 'right':
                AddTag('[right]', '[/right]');
                break;
            case 'center':
                AddTag('[center]', '[/center]');
                break;
            case 'InsertUnorderedList':
                AddList('[list][*]', '[/list]');
                break;
            case 'listElement':
                AddTag('[*]', '');
                break;
        }
    }
}

function doSize() {
    if (!editorVisible) {
        var listSizes = document.getElementById("select_size");
        var selectedIndex = listSizes.selectedIndex;
        if (selectedIndex >= 0) {
            var size = listSizes.options[selectedIndex].value;
            ifm.contentWindow.focus();
            if (size > 0)
                AddTag('[size=' + size + ']', '[/size]');
        }
    }
}

function resetSizeSelector() {
    var listSizes = document.getElementById("select_size");
    listSizes.options[0].selected = 'selected';
}

function resetIndentSelector() {
    var listIndents = document.getElementById("select_indent");
    listIndents.options[0].selected = 'selected';
}

function doIndent() {
    if (!editorVisible) {
        var listIndents = document.getElementById("select_indent");
        var selectedIndex = listIndents.selectedIndex;
        if (selectedIndex >= 0) {
            var indent = listIndents.options[selectedIndex].value;
            ifm.contentWindow.focus();
            if (indent > 0)
                AddTag('[indent=' + indent + ']', '[/indent]');
        }
    }
}

function doLink() {
    if (!editorVisible) {
        ifm.contentWindow.focus();
        var mylink = prompt("Enter a URL:", "http://");
        if ((mylink != null) && (mylink != "")) {
            AddTag('[url=' + mylink + ']', '[/url]');
        }
    }
}

function doImage() {
    if (!editorVisible) {
        ifm.contentWindow.focus();
        myimg = prompt('Enter Image URL:', 'http://');
        if ((myimg != null) && (myimg != "")) {
            AddTag('[img]' + myimg + '[/img]', '');
        }
    }
}

//textarea-mode functions
function MozillaInsertText(element, text, pos) {
    element.value = element.value.slice(0, pos) + text + element.value.slice(pos);
}

function AddTag(t1, t2) {
    var element = textboxelement;
    if (isIE) {
        if (document.selection) {
            element.focus();

            var txt = element.value;
            var str = document.selection.createRange();

            if (str.text == "") {
                str.text = t1 + t2;
            }
            else if (txt.indexOf(str.text) >= 0) {
                str.text = t1 + str.text + t2;
            }
            else {
                element.value = txt + t1 + t2;
            }
            str.select();
        }
    }
    else if (typeof(element.selectionStart) != 'undefined') {
        var sel_start = element.selectionStart;
        var sel_end = element.selectionEnd;
        MozillaInsertText(element, t1, sel_start);
        MozillaInsertText(element, t2, sel_end + t1.length);
        element.selectionStart = sel_start;
        element.selectionEnd = sel_end + t1.length + t2.length;
        element.focus();
    }
    else {
        element.value = element.value + t1 + t2;
    }
}

function AddList(t1, t2) {
    var element = textboxelement;
    if (isIE) {
        if (document.selection) {
            element.focus();

            var txt = element.value;
            var str = document.selection.createRange();

            if (str.text == "") {
                str.text = t1 + t2;
            }
            else if (txt.indexOf(str.text) >= 0) {
                str.text = t1 + str.text + t2;
            }
            else {
                element.value = txt + t1 + t2;
            }

            var value1 = str.text;
            var nPos1 = value1.indexOf("\n", '[list]'.length);
            if (nPos1 > 0) {
                value1 = value1.replace(/\n/gi, "[*]");
            }
            str.text = value1;


            str.select();
        }
    }
    else if (typeof(element.selectionStart) != 'undefined') {
        var sel_start = element.selectionStart;
        var sel_end = element.selectionEnd;
        MozillaInsertText(element, t1, sel_start);
        MozillaInsertText(element, t2, sel_end + t1.length);

        element.selectionStart = sel_start;
        element.selectionEnd = sel_end + t1.length + t2.length;

        sel_start = element.selectionStart;
        sel_end = element.selectionEnd;

        var value = element.value.substring(sel_start, sel_end);
        var nPos = value.indexOf("\n", '[list]'.length);
        if (nPos > 0) {
            value = value.replace(/\n/gi, "[*]");
        }
        var elvalue = element.value;
        value = value.replace(/\[list\]\[\*\]/gi, '[list]\n[*]');
        value = value.replace(/\[\/list\]/gi, '\n[/list]');
        element.value = elvalue.substring(0, sel_start) + value + elvalue.substring(sel_end, elvalue.length);


        element.focus();
    }
    else {
        element.value = element.value + t1 + t2;
    }
}

//=======color picker
function getScrollY() {
    var scrOfX = 0, scrOfY = 0;
    if (typeof (window.pageYOffset) == 'number') {
        scrOfY = window.pageYOffset;
        scrOfX = window.pageXOffset;
    } else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
        scrOfY = document.body.scrollTop;
        scrOfX = document.body.scrollLeft;
    } else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
        scrOfY = document.documentElement.scrollTop;
        scrOfX = document.documentElement.scrollLeft;
    }
    return scrOfY;
}

document.write("<style type='text/css'>.colorpicker201{visibility:hidden;display:none;position:absolute;background:#FFF;z-index:999;filter:progid:DXImageTransform.Microsoft.Shadow(color=#D0D0D0,direction=135);}.o5582brd{padding:0;width:12px;height:14px;border-bottom:solid 1px #DFDFDF;border-right:solid 1px #DFDFDF;}a.o5582n66,.o5582n66,.o5582n66a{font-family:arial,tahoma,sans-serif;text-decoration:underline;font-size:9px;color:#666;border:none;}.o5582n66,.o5582n66a{text-align:center;text-decoration:none;}a:hover.o5582n66{text-decoration:none;color:#FFA500;cursor:pointer;}.a01p3{padding:1px 4px 1px 2px;background:whitesmoke;border:solid 1px #DFDFDF;}</style>");

function getTop2() {
    csBrHt = 0;
    if (typeof (window.innerWidth) == 'number') {
        csBrHt = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        csBrHt = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        csBrHt = document.body.clientHeight;
    }
    ctop = ((csBrHt / 2) - 115) + getScrollY();
    return ctop;
}
var nocol1 = "&#78;&#79;&#32;&#67;&#79;&#76;&#79;&#82;",
    clos1 = "X";

function getLeft2() {
    var csBrWt = 0;
    if (typeof (window.innerWidth) == 'number') {
        csBrWt = window.innerWidth;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        csBrWt = document.documentElement.clientWidth;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        csBrWt = document.body.clientWidth;
    }
    cleft = (csBrWt / 2) - 125;
    return cleft;
}

//function setCCbldID2(val, textBoxID) { document.getElementById(textBoxID).value = val; }
function setCCbldID2(val) {
    if (!editorVisible)
        AddTag('[color=' + val + ']', '[/color]');
}

function setCCbldSty2(objID, prop, val) {
    switch (prop) {
        case "bc":
            if (objID != 'none') {
                document.getElementById(objID).style.backgroundColor = val;
            }
            ;
            break;
        case "vs":
            document.getElementById(objID).style.visibility = val;
            break;
        case "ds":
            document.getElementById(objID).style.display = val;
            break;
        case "tp":
            document.getElementById(objID).style.top = val;
            break;
        case "lf":
            document.getElementById(objID).style.left = val;
            break;
    }
}

function putOBJxColor2(Samp, pigMent, textBoxId) {
    if (pigMent != 'x') {
        setCCbldID2(pigMent, textBoxId);
        setCCbldSty2(Samp, 'bc', pigMent);
    }
    setCCbldSty2('colorpicker201', 'vs', 'hidden');
    setCCbldSty2('colorpicker201', 'ds', 'none');
}

function showColorGrid2(Sam, textBoxId) {
    if (!editorVisible) {
        var objX = new Array('00', '33', '66', '99', 'CC', 'FF');
        var c = 0;
        var xl = '"' + Sam + '","x", "' + textBoxId + '"';
        var mid = '';
        mid += '<table bgcolor="#FFFFFF" border="0" cellpadding="0" cellspacing="0" style="border:solid 0px #F0F0F0;padding:2px;"><tr>';
        mid += "<td colspan='9' align='left' style='margin:0;padding:2px;height:12px;' ><input class='o5582n66' type='text' size='12' id='o5582n66' value='#FFFFFF'><input class='o5582n66a' type='text' size='2' style='width:14px;' id='o5582n66a' onclick='javascript:alert(\"click on selected swatch below...\");' value='' style='border:solid 1px #666;'></td><td colspan='9' align='right'><a class='o5582n66' href='javascript:onclick=putOBJxColor2(" + xl + ")'><span class='a01p3'>" + clos1 + "</span></a></td></tr><tr>";
        var br = 1;
        for (o = 0; o < 6; o++) {
            mid += '</tr><tr>';
            for (y = 0; y < 6; y++) {
                if (y == 3) {
                    mid += '</tr><tr>';
                }
                for (x = 0; x < 6; x++) {
                    var grid = '';
                    grid = objX[o] + objX[y] + objX[x];
                    var b = "'" + Sam + "','" + grid + "', '" + textBoxId + "'";
                    mid += '<td class="o5582brd" style="background-color:#' + grid + '"><a class="o5582n66"  href="javascript:onclick=putOBJxColor2(' + b + ');" onmouseover=javascript:document.getElementById("o5582n66").value="#' + grid + '";javascript:document.getElementById("o5582n66a").style.backgroundColor="#' + grid + '";  title="#' + grid + '"><div style="width:12px;height:14px;"></div></a></td>';
                    c++;
                }
            }
        }
        mid += "</tr></table>";
        //var ttop=getTop2();
        //setCCbldSty2('colorpicker201','tp',ttop);
        //document.getElementById('colorpicker201').style.left=getLeft2();
        document.getElementById('colorpicker201').innerHTML = mid;
        setCCbldSty2('colorpicker201', 'vs', 'visible');
        setCCbldSty2('colorpicker201', 'ds', 'inline');
    }
}