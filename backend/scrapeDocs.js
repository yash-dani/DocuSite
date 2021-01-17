/*
*   MAIN SCRIPT: TURN DOC JSON TO HTML
*   INPUT: doc object from docs API
*   OUTPUT: HTML string
*/
// holds the really ugly import string for google fonts
const fontString = "<style>\n       @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Libre+Franklin:ital,wght@0,100;0,200;1,100;1,200&family=Open+Sans&display=swap');\n</style>"
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

  // parse the body, adding html elements
  html = parseBody(html, doc)
  // add last body tag
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
  var pageHeight = 1.33 * doc.documentStyle.pageSize.height.magnitude

  html += 'margin-top:' + marginHeader + 'px;'
  html += 'margin-bottom:' + marginBottom + 'px;'
  html += 'margin-left:' + marginLeft + 'px;'
  html += 'margin-right:' + marginRight + 'px;'
  html += 'height:' + pageHeight + 'px;'
  html += '"'

  return (html)
}

// Secondary Script: Create <head> tag using Google Doc
// INPUT: html string, document object title
// OUTPUT: updated html string
function parseTitle (html, title) {
  headTag = '<!DOCTYPE html>\n<head>\n    <title>' + title + '</title>\n</head>'
  return headTag
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
      backgroundColor += 'background-color:' + '#' + bColour.red + bColour.green + bColour.blue + ';'
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

// IGNORE THE REST OF THIS CODE (IT'S JUST A TEST BENCH + OTHER REFERENCES)

// Dummy/test setup (opening a test file and running the function on it)
const fs = require('fs')
const rawdata = fs.readFileSync('testDoc.json')
const doc = JSON.parse(rawdata)
fs.writeFile('test.html', docToHTML(doc), function (err) {
  if (err) throw err
  console.log('HTML Updated!')
})
fs.writeFile('styles.css', makeCssClasses(doc), function (err) {
  if (err) throw err
  console.log('CSS Updated!')
})

// ConvertGoogleDocToCleanHtml(doc);

// RANDOM GITHUB SCRIPT TESTING
// function ConvertGoogleDocToCleanHtml (doc) {
//   var body = doc.body.content
//   var numChildren = body.length
//   var output = []
//   var images = []
//   var listCounters = {}

//   // Walk through all the child elements of the body.
//   for (var i = 0; i < numChildren; i++) {
//     var child = body.content[i]
//     output.push(processItem(child, listCounters, images, doc))
//   }

//   var html = output.join('\r')
//   // emailHtml(html, images);
//   console.log(html)
//   // createDocumentForHtml(html, images);
// }

// function emailHtml (html, images) {
//   var attachments = []
//   for (var j = 0; j < images.length; j++) {
//     attachments.push({
//       fileName: images[j].name,
//       mimeType: images[j].type,
//       content: images[j].blob.getBytes()
//     })
//   }
// }

// function createDocumentForHtml (html, images) {
//   var name = DocumentApp.getActiveDocument().getName() + '.html'
//   var newDoc = DocumentApp.create(name)
//   newDoc.getBody().setText(html)
//   for (var j = 0; j < images.length; j++) { newDoc.getBody().appendImage(images[j].blob) }
//   newDoc.saveAndClose()
// }

function processParagraph (item, html, doc) {

  
  if(item.paragraph.bullet){
    inBullet = true
  }
  else{
    inBullet = false
  }

  html += '\n'
  html += '<div class=' + item.paragraph.paragraphStyle.namedStyleType + '>'
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
      html+='<form>'
      inForm=true
    }
    //end form tag
    else if(item.textRun.content==="\u003e\n" && inForm){
      html+='</form>'
      inForm=false
    }
    else if(inForm && inBullet){
      var str = item.textRun.content
      html+='<input type="radio" id="'+str+'" name="poggers">'
      html+='<label for="'+str+'">'+str+'</label><br>'
    }
    else if(inForm && textInput.test(item.textRun.content)){
      var str = item.textRun.content
      var res = str.split(":");
      var n = res[0]
      html += '<label for="'+n+'">'+n+'</label>'
      html += '<input id="'+n+'" name="'+n+'">'
    }
    else if(inForm && item.textRun.content.toLowerCase()==="submit\n"){
      html += '<input type="submit" value="Submit">'
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
  var marginLeft = 1.33 * doc.inlineObjects[id].inlineObjectProperties.embeddedObject.marginLeft.magnitude
  var marginRight = 1.33 * doc.inlineObjects[id].inlineObjectProperties.embeddedObject.marginRight.magnitude
  var height = 1.33 * doc.inlineObjects[id].inlineObjectProperties.embeddedObject.size.height.magnitude
  var width = 1.33 * doc.inlineObjects[id].inlineObjectProperties.embeddedObject.size.width.magnitude

  html += '<img src="' + uri + '" alt="' + id + '" id="' + id + '"'
  html += 'height="' + height.toString() + '"'
  html += ' width=' + width.toString() + '"'
  html += ' style="'
  html += 'margin-top:' + marginTop + 'px;'
  html += 'margin-bottom:' + marginBottom + 'px;'
  html += 'margin-left:' + marginLeft + 'px;'
  html += 'margin-right:' + marginRight + 'px;'
  html += '">'
  return html
}
