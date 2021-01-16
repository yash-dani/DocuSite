// Express to run server and routes
const express = require('express')

// Start up an instance of app
const app = express()

// Cors for cross origin allowance
const cors = require('cors')
app.use(cors())

/* Initializing the main project folder, point to folder with frontend files */
app.use(express.static('example'))

const port = 3000
// Spin up the server
app.listen(port, function () {
  console.log('server running')
  console.log(`running on localhost: ${port}`)
})

const baseURL = 'https://docs.googleapis.com/v1/documents/'

app.get('/convert/:docId', function (req, res) {
  getDocAsJson(baseURL, req.params.docId)
    .then(function (data) {
      res.send(convertDocToHTML(data))
    })
})

const getDocAsJson = async (baseURL, docId) => {
  // note: authorization scope must be added to the request
  const res = await fetch(baseURL + docId)
  try {
    const data = await res.json()
    return data
  } catch (error) {
    console.log(error)
  }
}

function convertDocToHTML (data) {
  // convert doc to html and return it
  
};
