const path = require('path')
const Promise = require('bluebird')
const express = require('express')
const request = Promise.promisifyAll(require('request'))

const app = express()

const SHOW_UNLABELLED_SERVICES = process.env.SHOW_UNLABELLED_SERVICES
const API_URL = 'http://rancher-metadata.rancher.internal/2016-07-29' // using internal DNS as workaround for https://github.com/rancher/rancher/issues/5041
const PROJECT_NAME_LABEL = 'io.rancher.statuspage.projectname'
const NAME_LABEL = 'io.rancher.statuspage.name'
const PRIORITY_LABEL = 'io.rancher.statuspage.priority'

const serviceStates = {
  active: 'success',
  upgraded: 'warning',
  upgrading: 'warning'
}

app.use(express.static(path.join(__dirname, 'static')))

app.get('/metadata', (req, res, next) => {
  request.getAsync({
    url: `${API_URL}/self/`,
    json: true
  })
  .then((response) => {
    const body = response.body
    res.send({
      environment: {
        name: body.service.labels[PROJECT_NAME_LABEL] || body.stack.environment_name
      }
    })
  })
  .catch(next)
})

app.get('/services', (req, res, next) => {
  request.getAsync({
    url: `${API_URL}/services`,
    json: true
  }).then((response) => {
    return response.body
  })
  .map((service, index) => {
    if (!SHOW_UNLABELLED_SERVICES && !service.labels[NAME_LABEL]) return null
    return {
      name: service.labels[NAME_LABEL] || `${service.stack_name} - ${service.name}`,
      sortValue: parseInt(service.labels[PRIORITY_LABEL]),
      status: serviceStates[service.state] || 'danger',
      statusMessage: service.state
    }
  })
  .filter((service) => {
    return service
  })
  .then((results) => {
    results.sort((s1, s2) => {
      if (s1.sortValue || s2.sortValue) return s1.sortValue < s2.sortValue
      return s1.name > s2.name
    })
    res.send(results)
  })
  .catch(next)
})

const port = process.env.PORT || 80
app.listen(port, (err) => {
  if (err) console.error(`failed to start, err: ${err.message} (port: ${port})`);
  else console.log(`listening on port ${port}`)
})
