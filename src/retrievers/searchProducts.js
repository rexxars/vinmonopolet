const getProducts = require('./getProducts')

module.exports = (query, opts) =>
  getProducts(Object.assign({query}, opts))
