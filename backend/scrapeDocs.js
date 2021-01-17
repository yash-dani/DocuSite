/*
*   MAIN SCRIPT: TURN DOC JSON TO HTML
*   INPUT: doc object from docs API
*   OUTPUT: HTML string
*/
// holds the really ugly import string for google fonts
const fontString = "<style>\n      @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville&family=Lora&family=Source+Sans+Pro&display=swap%27');\n</style>"
const styleString = "<link rel=\"stylesheet\" href=\"styles.css\">"
var inForm = false;
var inBullet = false
function docToHTML (doc) {
  // main string that stores HTML (yes this is a little janky)
  html = ''
  // create title for webpage and HTML <head> tag
  html = parseTitle(html, doc.title)
  html += '\n<body '
  html = addPageFormatting(html, doc)
  html += '>\n'
  // import fonts and start of body tag
  html += fontString
  html += styleString
  if ('defaultHeaderId' in doc.documentStyle) {
    html = parseHeader(html, doc)
  }
  // parse the body, adding html elements
  html = parseBody(html, doc)
  // add last body tag
  if ('defaultFooterId' in doc.documentStyle) {
    html = parseFooter(html, doc)
  }
  html += '</body>'
  return html
}

function addPageFormatting(html, doc) {
  html += 'style="'
  if (doc.documentStyle.background.color.color?.rgbColor) {
    var bColour = {
      red: '00',
      blue: '00',
      green: '00',
    }

    if (doc.documentStyle.background?.color?.color?.rgbColor?.red) {
      var redBg = (parseInt(doc.documentStyle.background.color.color.rgbColor.red * 255)).toString(16)
      bColour.red = redBg
    }
    if (doc.documentStyle.background?.color?.color?.rgbColor?.green) {
      var greenBg = (parseInt(doc.documentStyle.background.color.color.rgbColor.green * 255)).toString(16)
      bColour.green = greenBg
    }
    if (doc.documentStyle.background?.color?.color?.rgbColor?.blue) {
      var blueBg = (parseInt(doc.documentStyle.background.color.color.rgbColor.blue * 255)).toString(16)
      bColour.blue = blueBg
    }
    html += 'background-color:' + '#' + bColour.red + bColour.green + bColour.blue + ';'
  }
  
  var marginTop = 1.33 * doc.documentStyle.marginTop.magnitude
  var marginBottom = 1.33 * doc.documentStyle.marginBottom.magnitude
  var marginLeft = 1.33 * doc.documentStyle.marginLeft.magnitude
  var marginRight = 1.33 * doc.documentStyle.marginRight.magnitude
  var marginHeader = 1.33 * doc.documentStyle.marginHeader.magnitude
  var marginFooter = 1.33 * doc.documentStyle.marginFooter.magnitude
  // var pageHeight = 1.33 * doc.documentStyle.pageSize.height.magnitude

  if ('marginHeader' in doc.documentStyle) {
    html += 'margin-top:' + marginHeader + 'px;'
  } else if ('marginTop' in doc.documentStyle) {
    html += 'margin-top:' + marginTop + 'px; '
  }

  if ('marginFooter' in doc.documentStyle) {
    html += 'margin-bottom:' + marginFooter + 'px;'
  } else if ('marginBottom' in doc.documentStyle) {
    html += 'margin-bottom:' + marginBottom + 'px;'
  }

  html += 'margin-left:' + marginLeft + 'px;'
  html += 'margin-right:' + marginRight + 'px;'
  // html += 'height:' + pageHeight + 'px;'
  html += '"'

  return (html)
}

// Secondary Script: Create <head> tag using Google Doc
// INPUT: html string, document object title
// OUTPUT: updated html string
function parseTitle (html, title) {
  headTag = '<!DOCTYPE html>\n<head>\n    <title>' + title + '</title>\n<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">\n</head>'
  return headTag
}

function parseHeader (html, doc) {
  var headerId = doc.documentStyle.defaultHeaderId
  for (var i = 0; i < doc.headers[headerId].content.length; i++) {
    html = processParagraph(doc.headers[headerId].content[i], html, doc)
  }
  return html
}

// Secondary Script: Create <body> tag using Google Doc
// INPUT: html string, document object body
// OUTPUT: updated html string
// NOTE: only capable of parsing text at this point. Completely freezes if an image is at play.
function parseBody (html, doc) {
  // loop through each element in the content
  for (var i = 0; i < doc.body.content.length; i++) {
    // skip object describing section (for now)
    if (!('startIndex' in doc.body.content[i])) {
      continue
    }
    html = processParagraph(doc.body.content[i], html, doc)
  }
  return html
}

function parseFooter (html, doc) {
  var footerId = doc.documentStyle.defaultFooterId
  for (var i = 0; i < doc.footers[footerId].content.length; i++) {
    html = processParagraph(doc.footers[footerId].content[i], html, doc)
  }
  return html
}

function makeCssClasses(doc){
  cssOutput = ""
  namedStylesList = doc.namedStyles.styles;
  for(var i = 0; i < namedStylesList.length; i++){
    className = "." + namedStylesList[i].namedStyleType;
    textInfo = namedStylesList[i].textStyle;
    bold = textInfo.bold ? "font-weight: bold;" : "font-weight: normal;";
    italics = textInfo.italics ? "font-style: italic\;" : "font-style: normal;";
    if(textInfo.underline & textInfo.strikethrough){
      text_decoration = "text-decoration: underline line-through;";
    }
    else if(textInfo.underline){
      text_decoration = "text-decoration: underline;";
    }
    else if(textInfo.strikethrough){
      text_decoration = "text-decoration: strikethrough;";
    }
    else{
      text_decoration = "text-decoration: none;";
    }

    backgroundColor = "";
    if ('backgroundColor' in textInfo) {
      var bColour = {
        red: '00',
        blue: '00',
        green: '00',
        transp: '00'
      }
      if (textInfo?.backgroundColor?.color?.rgbColor?.red) {
        var redBg = (parseInt(textInfo.backgroundColor.color.rgbColor.red * 255)).toString(16)
        bColour.red = redBg
      }
      if (textInfo?.backgroundColor?.color?.rgbColor?.green) {
        var greenBg = (parseInt(textInfo.backgroundColor.color.rgbColor.green * 255)).toString(16)
        bColour.green = greenBg
      }
      if (textInfo?.backgroundColor?.color?.rgbColor?.blue) {
        var blueBg = (parseInt(textInfo.backgroundColor.color.rgbColor.blue * 255)).toString(16)
        bColour.blue = blueBg
      }
      if(bColour.red != '00' || bColour.blue != '00' | bColour.green != '00' ){
        bColour.transp = 'ff';
      }
      backgroundColor += 'background-color:' + '#' + bColour.red + bColour.green + bColour.blue + bColour.transp + ';'
    }
    
    color = "";
    if ('foregroundColor' in textInfo) {
      var fColour = {
        red: '00',
        blue: '00',
        green: '00'
      }
      if (textInfo?.foregroundColor?.color?.rgbColor?.red) {
        var redFg = (parseInt(textInfo.foregroundColor.color.rgbColor.red * 255)).toString(16);
        fColour.red = redFg;
      }
      if (textInfo?.foregroundColor?.color?.rgbColor?.green) {
        var greenFg = (parseInt(textInfo.foregroundColor.color.rgbColor.green * 255)).toString(16);
        fColour.green = greenFg;
      }
      if (textInfo?.foregroundColor?.color?.rgbColor?.blue) {
        var blueFg = (parseInt(textInfo.foregroundColor.color.rgbColor.blue * 255)).toString(16);
        fColour.blue = blueFg;
      }
      color += 'color:' + '#' + fColour.red + fColour.green + fColour.blue + ';'
    }

    font_family = "";
    if(textInfo?.weightedFontFamily?.fontFamily){
      font_family = "font-family: " + textInfo?.weightedFontFamily?.fontFamily + ";";
    }

    font_size = "";
    if(textInfo?.weightedFontFamily?.weight){
      font_size = "font-weight: " + textInfo?.weightedFontFamily?.weight + ";";
    }

    attributes = [bold, italics, text_decoration, backgroundColor, color, font_size, font_family];
    cssOutput += className + "{\n"
    for(var j = 0; j < attributes.length; j++){
      if(attributes[j] != ""){
        cssOutput += attributes[j] + "\n";
      }
    }
    cssOutput += "}\n";
  }
  return cssOutput;
}


function processParagraph (item, html, doc) {

  
  if(item?.paragraph?.bullet){
    inBullet = true
  }
  else{
    inBullet = false
  }

  html += '\n'
  html += '<div class=' + item.paragraph.paragraphStyle.namedStyleType + ' '
  if (item.paragraph.paragraphStyle.alignment === 'CENTER') {
    html += 'style="text-align:center"'
  } 
  html += '>'
  html += '\n'
  var numElements = item.paragraph.elements.length
  for (var i = 0; i < numElements; i++) {
    html = processElement(item.paragraph.elements[i], html, doc)
  }

  html += '</div>'
  html += '\n'
  return html
}

function processElement (item, html, doc) {
  if ('textRun' in item) {

    var textInput = new RegExp("\([a-zA-Z])+:_+");
    // process as a form tag
    if(item.textRun.content==="\u003cform\n" && !inForm){
      html+='<form><div>'
      inForm=true
    }
    //end form tag
    else if((item.textRun.content==="\u003e\n" || item.textRun.content==="\u003e") && inForm){
      html+='</form></div>'
      inForm=false
    }
    else if(inForm && inBullet){
      var str = item.textRun.content.replace(/^\s+|\s+$/g, '')
      html+='<div class="form-group">'
      html+='<input  type="radio" id="'+str+'" name="poggers">'
      html+='<label for="'+str+'">'+str+'</label><br>'
      html+='</div>'

    }
    else if(inForm && textInput.test(item.textRun.content)){
      var str = item.textRun.content.replace(/^\s+|\s+$/g, '')
      var res = str.split(":");
      var n = res[0]
      html+='<div class="form-group" style="width:100%">'
      // html+='<div class="col-xs-3">'
      // html+='</div>'
      // html+=' <div class="col-xs-12">'
      html += '<label  for="'+n+'">'+n+'</label><br>'
      html += '<input class="form-control" id="'+n+'" name="'+n+'">'

      // html+='</div>'
      // html+=' <div class="col-xs-3">'
      // html+='</div>'
      html+='</div>'
    }
    else if(inForm && item.textRun.content.toLowerCase()==="submit\n"){
      html += '<br><input type="submit" class="btn btn-outline-secondary" value="Submit">'
    }
    else if (item.textRun.content === '\n') {
      html += '<br>'
    }
    else{
      html = processText(item.textRun, html, doc)
    }
  }
  if ('inlineObjectElement' in item) {
    html = processImage(item.inlineObjectElement, html, doc)
  }
  return html
}

function processText (textRun, html, doc) {
  var text = textRun.content
  html += '\t'
  // Assuming that a whole para fully italic is a quote
  html += '<span style="'

  if ('backgroundColor' in textRun.textStyle) {
    var bColour = {
      red: '00',
      blue: '00',
      green: '00'
    }
    if ('red' in textRun.textStyle.backgroundColor.color?.rgbColor) {
      var redBg = (parseInt(textRun.textStyle.backgroundColor.color.rgbColor.red * 255)).toString(16)
      bColour.red = redBg
    }
    if ('green' in textRun.textStyle.backgroundColor.color?.rgbColor) {
      var greenBg = (parseInt(textRun.textStyle.backgroundColor.color.rgbColor.green * 255)).toString(16)
      bColour.green = greenBg
    }
    if ('blue' in textRun.textStyle.backgroundColor.color?.rgbColor) {
      var blueBg = (parseInt(textRun.textStyle.backgroundColor.color.rgbColor.blue * 255)).toString(16)
      bColour.blue = blueBg
    }
    html += 'background-color:' + '#' + bColour.red + bColour.green + bColour.blue + ';'
  }

  if ('foregroundColor' in textRun.textStyle) {
    var fColour = {
      red: '00',
      blue: '00',
      green: '00'
    }
    if ('red' in textRun.textStyle.foregroundColor.color.rgbColor) {
      var redFg = (parseInt(textRun.textStyle.foregroundColor.color.rgbColor.red * 255)).toString(16)
      fColour.red = redFg
    }
    if ('green' in textRun.textStyle.foregroundColor.color.rgbColor) {
      var greenFg = (parseInt(textRun.textStyle.foregroundColor.color.rgbColor.green * 255)).toString(16)
      fColour.green = greenFg
    }
    if ('blue' in textRun.textStyle.foregroundColor.color.rgbColor) {
      var blueFg = (parseInt(textRun.textStyle.foregroundColor.color.rgbColor.blue * 255)).toString(16)
      fColour.blue = blueFg
    }
    html += 'color:' + '#' + fColour.red + fColour.green + fColour.blue + ';'
  }

  if ('fontSize' in textRun.textStyle) {
    var fontSize = 1.33 * textRun.textStyle.fontSize.magnitude
    html += 'font-size:' + fontSize + 'px;'
  }

  if ('weightedFontFamily' in textRun.textStyle) {
    html += 'font-family:' + textRun.textStyle.weightedFontFamily.fontFamily + ';'
    html += 'font-weight:' + textRun.textStyle.weightedFontFamily.weight.toString() + ';'
  }

  html += '">'

  if (textRun.textStyle.bold) {
    html += '<strong>'
  }
  if (textRun.textStyle.italic) {
    html += '<i>'
  }
  if (textRun.textStyle.underline) {
    html += '<u>'
  }
  if (textRun.textStyle.strikethrough) {
    html += '<s>'
  }
  if ('link' in textRun.textStyle) {
    // add handling for bookmarkId or heading Id
    html += '<a href="' + textRun.textStyle.link.url + '" rel="nofollow" style="color: inherit;text-decoration:inherit">'
  }

  text = text.replace(/\s/g, '&nbsp')
  html += text

  if ('link' in textRun.textStyle) {
    html += '</a>'
  }
  if (textRun.textStyle.strikethrough) {
    html += '</s>'
  }
  if (textRun.textStyle.underline) {
    html += '</u>'
  }
  if (textRun.textStyle.italic) {
    html += '</i>'
  }
  if (textRun.textStyle.bold) {
    html += '</strong>'
  }

  html += '</span>'
  html += '\n'
  return html
}

function processImage (item, html, doc) {
  var id = item.inlineObjectId
  var uri = doc.inlineObjects[id].inlineObjectProperties.embeddedObject.imageProperties.contentUri

  var marginTop = 1.33 * doc.inlineObjects[id].inlineObjectProperties.embeddedObject.marginTop.magnitude
  var marginBottom = 1.33 * doc.inlineObjects[id].inlineObjectProperties.embeddedObject.marginBottom.magnitude
  // var marginLeft = 1.33 * doc.inlineObjects[id].inlineObjectProperties.embeddedObject.marginLeft.magnitude
  var marginRight = 1.33 * doc.inlineObjects[id].inlineObjectProperties.embeddedObject.marginRight.magnitude
  var height = 1.33 * doc.inlineObjects[id].inlineObjectProperties.embeddedObject.size.height.magnitude
  var width = 1.33 * doc.inlineObjects[id].inlineObjectProperties.embeddedObject.size.width.magnitude

  html += '<img src="' + uri + '" alt="' + id + '" id="' + id + '"'
  html += 'height="' + height.toString() + '"'
  html += ' width=' + width.toString() + '"'
  html += ' style="'
  html += 'margin-top:' + marginTop + 'px;'
  html += 'margin-bottom:' + marginBottom + 'px;'
  // html += 'margin-left:' + marginLeft + 'px;'
  html += 'margin-right:' + marginRight + 'px;'
  html += '">'
  return html
}

// IGNORE THE REST OF THIS CODE (IT'S JUST A TEST BENCH + OTHER REFERENCES)

// Dummy/test setup (opening a test file and running the function on it)
const fs = require('fs')
const rawdata = fs.readFileSync('testDoc.json')
const doc = JSON.parse(rawdata)

function test() {
  fs.writeFileSync('test.html', docToHTML(doc), function (err) {
    if (err) throw err
    console.log('HTML Updated!')
  })
  fs.writeFileSync('styles.css', makeCssClasses(doc), function (err) {
    if (err) throw err
    console.log('CSS Updated!')
  })
}
test()

// function deploySite(obj) {
//   var shell = require('shelljs');
//   fs.writeFileSync('test.html', docToHTML(obj), function (err) {
//     if (err) throw err
//     console.log('HTML Updated!')
//   })
//   fs.writeFileSync('styles.css', makeCssClasses(obj), function (err) {
//     if (err) throw err
//     console.log('CSS Updated!')
//   })
// //   var dt = new Date();
// //     while ((new Date()) - dt <= 15000) { /* Do nothing */ }
// //   //docToHTML(obj);
// //   shell.cp('test.html', 'my-site/public/index.html');
// //   shell.cp('styles.css', 'my-site/public/styles.css');
// //   shell.cd('my-site');

// //   out = ''
// //   // a = shell.exec('wrangler publish', async function(code, stdout, stderr) {
// //   //     //console.log('IT WORKS ', stderr.split('\n')[5]);
// //   //     b = stderr.split('\n')[5];
// //   //     out.test = b;
// //   // });
// //   a = shell.exec('wrangler publish').stderr.split('\n')[5];
// //   shell.cd('..');
// //   //test = await setTimeout(test, 15000, 'funky');
// //   console.log("OUT ", a);
// //   return a;
// // }
// // //deploySite(doc);
// // module.exports = {
// //   deploySite
// };