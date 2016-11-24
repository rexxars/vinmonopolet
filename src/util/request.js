const {fetch} = require('fetch-ponyfill')()
const qs = require('query-string')
const promiseProps = require('promise-props')

const baseUrl = 'https://app.vinmonopolet.no/vmpws/v2/vmpSite'

function request(path, options = {}) {
  const query = options.query ? `?${qs.stringify(options.query)}` : ''
  const reqOpts = options.request || {}

  return fetch(`${baseUrl}${path}${query}`, reqOpts)
    .then(res => promiseProps({
      response: res,
      body: res.json()
    }))
    .then(data => {
      const {body, response} = data
      if (body.errors && body.errors.length > 0) {
        const baseErr = `HTTP ${response.status} ${response.statusText}`.trim()
        const errMsg = [baseErr].concat(body.errors.map(stringifyError)).join('\n\n')
        throw new Error(errMsg)
      }

      return body
    })
}

request.raw = url => fetch(url).then(res => res.text())

function stringifyError(err) {
  const type = err.type ? `${err.type}: ` : ''
  return `${type}${err.message}`
}

module.exports = request
