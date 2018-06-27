const request = require('request-promise-native')
const objectAssign = require('object-assign')
const qs = require('query-string')
const promiseProps = require('promise-props')

const baseUrl = 'https://app.vinmonopolet.no/vmpws/v2/vmp'

function sendRequest(path, options = {}) {
  const query = options.query ? `?${qs.stringify(options.query)}` : ''
  const reqOpts = options.request || {}
  const base = options.baseUrl || baseUrl
  const url = `${base}${path}${query}`

  return request(objectAssign({url, jar: true}, reqOpts))
}

sendRequest.get = (path, options) =>
  sendRequest(path, objectAssign({}, options, {request: {resolveWithFullResponse: true, json: true}}))
    .then(res => promiseProps({
      response: res,
      body: res.body
    }))
    .then(data => {
      const {body, response} = data
      if (response.statusCode >= 400 || (body.errors && body.errors.length > 0)) {
        throw new Error(getErrorMessage(response, body))
      }

      return body
    })

sendRequest.head = (path, options) =>
  sendRequest(path, objectAssign({}, options, {request: {resolveWithFullResponse: true, method: 'HEAD'}}))

sendRequest.raw = url => request(url, {jar: true})

function getErrorMessage(response, body) {
  const errors = body.errors || []
  const baseErr = `HTTP ${response.status} ${response.statusText}`.trim()
  const errMsg = [baseErr].concat(errors.map(stringifyError)).join('\n\n')
  return errMsg
}

function stringifyError(err) {
  const type = err.type ? `${err.type}: ` : ''
  return `${type}${err.message}`
}

module.exports = sendRequest
