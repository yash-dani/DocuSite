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

app.get('/convert/:docId', function (req, res) {
  res.send(convertDocToHTML(req.params.docId))
})

function convertDocToHTML (docId) {
  // convert doc to html and return it
};
