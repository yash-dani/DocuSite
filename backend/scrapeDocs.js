/*
*   MAIN SCRIPT: TURN DOC JSON TO HTML
*   INPUT: doc object from docs API
*   OUTPUT: HTML string
*/
// holds the really ugly import string for google fonts
const fontString = "<style>\n       @import url('https://fonts.googleapis.com/css2?family=Lato&family=Montserrat&family=Open+Sans&family=Poppins&family=Roboto&display=swap');\n</style>"

function docToHTML (doc) {
  // main string that stores HTML (yes this is a little janky)
  html = ''
  // create title for webpage and HTML <head> tag
  html = parseTitle(html, doc.title)
  html += '\n<body '
  // html = addBackgroundColor(html, doc)
  html += '>\n'
  // import fonts and start of body tag
  html += fontString

  console.log(makeCssClasses(html, doc));

  // parse the body, adding html elements
  html = parseBody(html, doc.body)
  // add last body tag
  html += '</body>'
  return html
}

function addBackgroundColor (html, doc) {
  red_bg = (parseInt(doc.documentStyle.background.color.color.rgbColor.red) * 255).toString(16)
  green_bg = (parseInt(doc.documentStyle.background.color.color.rgbColor.green) * 255).toString(16)
  blue_bg = (parseInt(doc.documentStyle.background.color.color.rgbColor.blue) * 255).toString(16)
  html += 'style="background-color:' + '#' + red_bg + green_bg + blue_bg + '"'
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
function parseBody (html, body) {
  // loop through each element in the content
  for (var i = 0; i < body.content.length; i++) {
    // skip object describing section (for now)
    if (!('startIndex' in body.content[i])) {
      continue
    }
    html = processParagraph(body.content[i], html, body)
  }
  return html
}


function makeCssClasses(cssFile, doc){
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


    cssOutput = className + "{"
    for(var j = 0; j < attributes.length; j++){
      if(attributes[j] != ""){
        cssOutput += attributes[j] + "\n";
      }
    }
    cssOutput += "}";
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
  console.log('Updated!')
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
  console.log(item)
  if ('textRun' in item) {
    html = processText(item.textRun, html, doc)
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
    if ('red' in textRun.textStyle.backgroundColor.color.rgbColor) {
      var redBg = (parseInt(textRun.textStyle.backgroundColor.color.rgbColor.red) * 255).toString(16)
      bColour.red = redBg
    }
    if ('green' in textRun.textStyle.backgroundColor.color.rgbColor) {
      var greenBg = (parseInt(textRun.textStyle.backgroundColor.color.rgbColor.green) * 255).toString(16)
      bColour.green = greenBg
    }
    if ('blue' in textRun.textStyle.backgroundColor.color.rgbColor) {
      var blueBg = (parseInt(textRun.textStyle.backgroundColor.color.rgbColor.blue) * 255).toString(16)
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
      var redFg = (parseInt(textRun.textStyle.foregroundColor.color.rgbColor.red) * 255).toString(16)
      fColour.red = redFg
    }
    if ('green' in textRun.textStyle.foregroundColor.color.rgbColor) {
      var greenFg = (parseInt(textRun.textStyle.foregroundColor.color.rgbColor.green) * 255).toString(16)
      fColour.green = greenFg
    }
    if ('blue' in textRun.textStyle.foregroundColor.color.rgbColor) {
      var blueFg = (parseInt(textRun.textStyle.foregroundColor.color.rgbColor.blue) * 255).toString(16)
      fColour.blue = blueFg
    }
    html += 'color:' + '#' + fColour.red + fColour.green + fColour.blue + ';'
  }

  if ('fontSize' in textRun.textStyle) {
    var fontSize = 1.33 * textRun.textStyle.fontSize.magnitude
    html += 'font-size:' + fontSize + ';'
  }

  if ('weightedFontFamily' in textRun.textStyle) {
    html += 'font-family:' + textRun.textStyle.weightedFontFamily.fontFamily + ';'
    html += 'font-weight:' + textRun.textStyle.weightedFontFamily.fontWeight + ';'
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
    html += '<a href="' + textRun.link.url + '" rel="nofollow">'
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

function processImage (item, images, output, doc) {
  var id = item.inlineObjectElement.inlineObjectId
  var uri = doc.inlineObjects[id].inlineObjectProperties.embeddedObject.imageProperties.contentUri

  output.push('<img src=' + uri + 'alt' + id + 'id=' + id)
}
