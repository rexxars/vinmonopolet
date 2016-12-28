const promiseMap = require('promise-map-limit')
const getProduct = require('./getProduct')

module.exports = function (ids, options) {
  const opts = options || {}
  return promiseMap(ids, opts.concurrency || 5, getProduct)
}
