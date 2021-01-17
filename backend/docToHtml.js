// Express to run server and routes
const express = require('express')
const fetch = require('node-fetch')
const { google } = require('googleapis')

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

const baseURL = 'https://docs.googleapis.com/v1/documents/'

const oauth2Client = new google.auth.OAuth2(
  '1051440759200-r2ldquvemlrea60lqrejgf000cg25duo.apps.googleusercontent.com',
  '_ilOI692329G0vammZLboWWs',
  'http://localhost:3001/oauth2callback'
)

const scopes = [
  'https://www.googleapis.com/auth/documents'
]

async function authenticate (scopes) {
  return new Promise((resolve, reject) => {
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes
    })
    const server = http
      .createServer(async (req, res) => {
        try {
          if (req.url.indexOf('/oauth2callback') > -1) {
            const qs = new url.URL(req.url, 'http://localhost:3000')
              .searchParams
            res.end('Authentication successful! Please return to the console.')
            server.destroy()
            const { tokens } = await oauth2Client.getToken(qs.get('code'))
            oauth2Client.credentials = tokens // eslint-disable-line require-atomic-updates
            resolve(oauth2Client)
          }
        } catch (e) {
          reject(e)
        }
      })
      .listen(3000, () => {
        // open the browser to the authorize url to start the workflow
        opn(authorizeUrl, { wait: false }).then(cp => cp.unref())
      })
    destroyer(server)
  })
}
const url = oauth2Client.generateAuthUrl({
  scope: scopes
})

app.get('/convert/:docId', function (req, res) {
  getDocAsJson(baseURL, req.params.docId)
    .then(function (data) {
      res.send(convertDocToHTML(data))
    })
})

const getDocAsJson = async (baseURL, docId) => {
  // note: authorization scope must be added to the request
  try {
    console.log(docId)
    const res = await fetch(baseURL + docId)
    const data = await res.json()
    return data
  } catch (error) {
    console.log(error)
  }
}

function convertDocToHTML (data) {
  // convert doc to html and return it

};
