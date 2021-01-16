/*
*   MAIN SCRIPT: TURN DOC JSON TO HTML
*   INPUT: doc object from docs API
*   OUTPUT: HTML string
*/
function docToHTML (doc) {
  // main string that stores HTML (yes this is a little janky)
  html = ''
  // create title for webpage and HTML <head> tag
  html = parseTitle(html, doc.title)
  return html
}

// Secondary Script: Create <head> tag using Google Doc
// INPUT: html string, document object title
// OUTPUT: same html string
function parseTitle (html, title) {
  headTag = '<!DOCTYPE html>\n<head>\n    <title>' + title + '</title>\n</head>'
  return headTag
}

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
    output.push(processItem(child, listCounters, images))
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

  var inlineImages = {}
  for (var j = 0; j < images.length; j++) {
    inlineImages[[images[j].name]] = images[j].blob
  }

  var name = DocumentApp.getActiveDocument().getName() + '.html'
  attachments.push({ fileName: name, mimeType: 'text/html', content: html })
  MailApp.sendEmail({
    to: Session.getActiveUser().getEmail(),
    subject: name,
    htmlBody: html,
    inlineImages: inlineImages,
    attachments: attachments
  })
}

function createDocumentForHtml (html, images) {
  var name = DocumentApp.getActiveDocument().getName() + '.html'
  var newDoc = DocumentApp.create(name)
  newDoc.getBody().setText(html)
  for (var j = 0; j < images.length; j++) { newDoc.getBody().appendImage(images[j].blob) }
  newDoc.saveAndClose()
}

function dumpAttributes (atts) {
  // Log the paragraph attributes.
  for (var att in atts) {
    Logger.log(att + ':' + atts[att])
  }
}

function processItem (item, listCounters, images) {
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
    processImage(item, images, output)
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
    processText(item, output)
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

function processText (item, output) {
  var text = item.getText()
  var indices = item.getTextAttributeIndices()

  if (indices.length <= 1) {
    // Assuming that a whole para fully italic is a quote
    if (item.isBold()) {
      output.push('<strong>' + text + '</strong>')
    } else if (item.isItalic()) {
      output.push('<blockquote>' + text + '</blockquote>')
    } else if (text.trim().indexOf('http://') == 0) {
      output.push('<a href="' + text + '" rel="nofollow">' + text + '</a>')
    } else if (text.trim().indexOf('https://') == 0) {
      output.push('<a href="' + text + '" rel="nofollow">' + text + '</a>')
    } else {
      output.push(text)
    }
  } else {
    for (var i = 0; i < indices.length; i++) {
      var partAtts = item.getAttributes(indices[i])
      var startPos = indices[i]
      var endPos = i + 1 < indices.length ? indices[i + 1] : text.length
      var partText = text.substring(startPos, endPos)

      Logger.log(partText)

      if (partAtts.ITALIC) {
        output.push('<i>')
      }
      if (partAtts.BOLD) {
        output.push('<strong>')
      }
      if (partAtts.UNDERLINE) {
        output.push('<u>')
      }

      // If someone has written [xxx] and made this whole text some special font, like superscript
      // then treat it as a reference and make it superscript.
      // Unfortunately in Google Docs, there's no way to detect superscript
      if (partText.indexOf('[') == 0 && partText[partText.length - 1] == ']') {
        output.push('<sup>' + partText + '</sup>')
      } else if (partText.trim().indexOf('http://') == 0) {
        output.push('<a href="' + partText + '" rel="nofollow">' + partText + '</a>')
      } else if (partText.trim().indexOf('https://') == 0) {
        output.push('<a href="' + partText + '" rel="nofollow">' + partText + '</a>')
      } else {
        output.push(partText)
      }

      if (partAtts.ITALIC) {
        output.push('</i>')
      }
      if (partAtts.BOLD) {
        output.push('</strong>')
      }
      if (partAtts.UNDERLINE) {
        output.push('</u>')
      }
    }
  }
}

function processImage (item, images, output) {
  images = images || []
  var blob = item.getBlob()
  var contentType = blob.getContentType()
  var extension = ''
  if (/\/png$/.test(contentType)) {
    extension = '.png'
  } else if (/\/gif$/.test(contentType)) {
    extension = '.gif'
  } else if (/\/jpe?g$/.test(contentType)) {
    extension = '.jpg'
  } else {
    throw 'Unsupported image type: ' + contentType
  }
  var imagePrefix = 'Image_'
  var imageCounter = images.length
  var name = imagePrefix + imageCounter + extension
  imageCounter++
  output.push('<img src="cid:' + name + '" />')
  images.push({
    blob: blob,
    type: contentType,
    name: name
  })
}