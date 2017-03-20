const path = require('path')
const Promise = require('bluebird')
const express = require('express')
const request = Promise.promisifyAll(require('request'))

const app = express()

app.use(express.static(path.join(__dirname,'static')))

app.get('/metadata',(req,res,next) => {
  res.send({
    environment: {
      name: 'Test env'
    }
  })
})

app.get('/services',(req,res,next) => {
  res.send([
    {name: 'Service 1', status: 'ok', statusMessage: 'operational'},
    {name: 'Service 2', status: 'warning', statusMessage: 'unhealthy'},
    {name: 'Service 3', status: 'danger', statusMessage: 'error'}
  ])
})

const port = process.env.PORT || 3000
app.listen(port,(err) => {
  if(err) console.error(`failed to start, err: ${err.message} (port: ${port})`);
  else console.log(`listening on port ${port}`)
})
