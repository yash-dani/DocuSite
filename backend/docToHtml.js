// Express to run server and routes
const express = require('express')
const fetch = require('node-fetch')
const { google } = require('googleapis')
const docs = google.docs('v1')

// Start up an instance of app
const app = express()

// Cors for cross origin allowance
const cors = require('cors')
app.use(cors())

/* Initializing the main project folder, point to folder with frontend files */
app.use(express.static('example'))

const port = 3001
// Spin up the server
app.listen(port, function () {
  console.log('server running')
  console.log(`running on localhost: ${port}`)
})

var docUrl = ''

const oauth2Client = new google.auth.OAuth2(
  '1051440759200-r2ldquvemlrea60lqrejgf000cg25duo.apps.googleusercontent.com',
  '_ilOI692329G0vammZLboWWs',
  'http://localhost:3001/oauth2callback'
)

google.options({ auth: oauth2Client })

const scopes = [
  'https://www.googleapis.com/auth/documents'
]

app.get('/convert/:docUrl', function (req, res) {
  docUrl = req.params.docUrl
  console.log(docUrl)
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
  })
  res.redirect(authorizeUrl)
})

app.get('/oauth2callback', async (req, res) => {
  const { tokens } = await oauth2Client.getToken(req.query.code)
  oauth2Client.setCredentials(tokens)
  const response = await docs.documents.get({ documentId: docUrl })
  console.log(response.data)
})

const baseURL = 'https://docs.googleapis.com/v1/documents/'

app.get('/convertAuth/:docUrl', async (req, res) => {
  docUrl = req.params.docUrl
  const something = await getDocAsJson(baseURL, docUrl)
  console.log(something)
})

const getDocAsJson = async (baseURL, docId) => {
  // note: authorization scope must be added to the request
  try {
    console.log(docId)
    const res = await fetch(baseURL + docId, {
      headers: {
        Authorization: 'Bearer ya29.a0AfH6SMB25PY7Hf5qo59UUxwPYOQAis5AB6b43EzRGPngwwWjG5V7IEJFOGJkvuZeIn7_ojxeO-Wa4BqOZjzNj2_FB8pq5_OHa4IBqZuj1dlJP-lz186TyjVmnXbsFF-pIk1vZ06SJMMNH2fHFlCL9XgFO5dD9KQlQLTGAmgvzF8'
      }
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.log(error)
  }
}

function convertDocToHTML (data) {
  // convert doc to html and return it

};
