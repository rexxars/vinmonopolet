const {fetch} = require('fetch-ponyfill')()
const qs = require('query-string')
const promiseProps = require('promise-props')

const baseUrl = 'https://app.vinmonopolet.no/vmpws/v2/vmpSite'

function request(path, options = {}) {
  const query = options.query ? `?${qs.stringify(options.query)}` : ''
  const reqOpts = options.request || {}
  const url = `${baseUrl}${path}${query}`

  return fetch(url, reqOpts)
}

request.get = (path, options) =>
  request(path, options)
    .then(res => promiseProps({
      response: res,
      body: res.json()
    }))
    .then(data => {
      const {body, response} = data
      if (response.statusCode >= 400 || (body.errors && body.errors.length > 0)) {
        throw new Error(getErrorMessage(response, body))
      }

      return body
    })

request.head = (path, options) =>
  request(path, Object.assign({}, options, {request: {method: 'HEAD'}}))

request.raw = url => fetch(url).then(res => res.text())

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

module.exports = request
