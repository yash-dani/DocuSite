/*
*   MAIN SCRIPT: TURN DOC JSON TO HTML
*   INPUT: doc object from docs API
*   OUTPUT: HTML string
*/
// holds the really ugly import string for google fonts
const fontString = "<style>\n       @import url('https://fonts.googleapis.com/css2?family=Lato&family=Montserrat&family=Open+Sans&family=Poppins&family=Roboto&display=swap');\n    </style>"

function docToHTML (doc) {
  // main string that stores HTML (yes this is a little janky)
  html = ''
  // create title for webpage and HTML <head> tag
  html = parseTitle(html, doc.title)
  html += '\n<body '
  html = addBackgroundColor(html, doc)
  html += '>\n'
  // import fonts and start of body tag
  html += fontString

  console.log(makeCssClasses(html, doc));

  // parse the body, adding html elements
  html = parseBody(html, doc.body)
  // add last body tag
  html += '\n</body>'
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
  for (i = 0; i < body.content.length; i++) {
    // skip object describing section (for now)
    if (!('startIndex' in body.content[i])) {
      continue
    }
    paragraph = body.content[i].paragraph
    for (j = 0; j < paragraph.elements.length; j++) {
      console.log(paragraph.elements[j])
      // text = paragraph.elements[j].textRun.content;
      // console.log(text);
    }
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
console.log(docToHTML(doc))
fs.writeFile('test.html', docToHTML(doc), function (err) {
  if (err) throw err
  console.log('Updated!')
})
console.log(doc.body)

// ConvertGoogleDocToCleanHtml(doc);

// RANDOM GITHUB SCRIPT TESTING
function ConvertGoogleDocToCleanHtml (doc) {
  var body = doc.body.content
  var numChildren = body.length
  var output = []
  var images = []
  var listCounters = {}

  // Walk through all the child elements of the body.
  for (var i = 0; i < numChildren; i++) {
    var child = body.content[i]
    output.push(processItem(child, listCounters, images, doc))
  }

  var html = output.join('\r')
  // emailHtml(html, images);
  console.log(html)
  // createDocumentForHtml(html, images);
}

function emailHtml (html, images) {
  var attachments = []
  for (var j = 0; j < images.length; j++) {
    attachments.push({
      fileName: images[j].name,
      mimeType: images[j].type,
      content: images[j].blob.getBytes()
    })
  }
}

function createDocumentForHtml (html, images) {
  var name = DocumentApp.getActiveDocument().getName() + '.html'
  var newDoc = DocumentApp.create(name)
  newDoc.getBody().setText(html)
  for (var j = 0; j < images.length; j++) { newDoc.getBody().appendImage(images[j].blob) }
  newDoc.saveAndClose()
}

function processItem (item, listCounters, images, doc) {
  var output = []
  var prefix = ''; var suffix = ''

  if ('paragraph' in item) {
    switch (item.paragraph.paragraphStyle.namedStyleType) {
      // Add a # for each heading level. No break, so we accumulate the right number.
      case 'HEADING_6':
        prefix = '<h6>'
        suffix = '</h6>'
        break
      case 'HEADING_5':
        prefix = '<h5>'
        suffix = '</h5>'
        break
      case 'HEADING_4':
        prefix = '<h4>'
        suffix = '</h4>'
        break
      case 'HEADING_3':
        prefix = '<h3>'
        suffix = '</h3>'
        break
      case 'HEADING_2':
        prefix = '<h2>'
        suffix = '</h2>'
        break
      case 'HEADING_1':
        prefix = '<h1>'
        suffix = '</h1>'
        break
      default:
        prefix = '<p>'
        suffix = '</p>'
    }

    if (item.elements.length === 0) { return '' }
  } else if ('inlineObjectElement' in item) {
    processImage(item, images, output, doc)
  }
  // else if ('bullet' in item) {
  //   var listItem = item
  //   var gt = listItem.getGlyphType()
  //   var key = listItem.getListId() + '.' + listItem.getNestingLevel()
  //   var counter = listCounters[key] || 0

  //   // First list item
  //   if (counter == 0) {
  //     // Bullet list (<ul>):
  //     if (gt === DocumentApp.GlyphType.BULLET ||
  //           gt === DocumentApp.GlyphType.HOLLOW_BULLET ||
  //           gt === DocumentApp.GlyphType.SQUARE_BULLET) {
  //       prefix = '<ul><li>', suffix = '</li>'

  //       suffix += '</ul>'
  //     } else {
  //       // Ordered list (<ol>):
  //       prefix = '<ol><li>', suffix = '</li>'
  //     }
  //   } else {
  //     prefix = '<li>'
  //     suffix = '</li>'
  //   }

  //   if (item.isAtDocumentEnd() || (item.getNextSibling() && (item.getNextSibling().getType() != DocumentApp.ElementType.LIST_ITEM))) {
  //     if (gt === DocumentApp.GlyphType.BULLET ||
  //           gt === DocumentApp.GlyphType.HOLLOW_BULLET ||
  //           gt === DocumentApp.GlyphType.SQUARE_BULLET) {
  //       suffix += '</ul>'
  //     } else {
  //       // Ordered list (<ol>):
  //       suffix += '</ol>'
  //     }
  //   }

  //   counter++
  //   listCounters[key] = counter
  // }

  output.push(prefix)

  if ('textRun' in item) {
    processText(item, output, doc)
  } else {
    if ('elements' in item) {
      var numChildren = item.elements.length

      // Walk through all the child elements of the doc.
      for (var i = 0; i < numChildren; i++) {
        var child = item.elements[i]
        output.push(processItem(child, listCounters, images))
      }
    }
  }

  output.push(suffix)
  return output.join('')
}

function processParagraph (item, html, doc) {
  html += '<div class=' + item.paragraph.paragraphStyles.namedStyleType + '>'

  var numElements = item.elements.length

  for (var i; i < numElements; i++) {
    processElement(item[i])
  }

  html += '</div>'
}

function processElement (item, html, doc) {
  if ('textRun' in item) {
    processText(item.textRun, html, doc)
  }
}

function processText (textRun, html, doc) {
  var text = textRun.content
  // Assuming that a whole para fully italic is a quote
  html += '<span style="'

  if ('backgroundColor' in textRun.textStyle) {
    var redBg = (parseInt(textRun.textStyle.backgroundColor.color.rgbColor.red) * 255).toString(16)
    var greenBg = (parseInt(textRun.textStyle.backgroundColor.color.rgbColor.green) * 255).toString(16)
    var blueBg = (parseInt(textRun.textStyle.backgroundColor.color.rgbColor.blue) * 255).toString(16)
    html += 'background-color:' + '#' + redBg + greenBg + blueBg + ';'
  }

  if ('foregroundColor' in textRun.textStyle) {
    var redFg = (parseInt(textRun.textStyle.foregroundColor.color.rgbColor.red) * 255).toString(16)
    var greenFg = (parseInt(textRun.textStyle.foregroundColor.color.rgbColor.green) * 255).toString(16)
    var blueFg = (parseInt(textRun.textStyle.foregroundColor.color.rgbColor.blue) * 255).toString(16)
    html += 'color:' + '#' + redFg + greenFg + blueFg + ';'
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
}

function processImage (item, images, output, doc) {
  var id = item.inlineObjectElement.inlineObjectId
  var uri = doc.inlineObjects[id].inlineObjectProperties.embeddedObject.imageProperties.contentUri

  output.push('<img src=' + uri + 'alt' + id + 'id=' + id)
}
