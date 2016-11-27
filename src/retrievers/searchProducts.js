const objectAssign = require('object-assign')
const getProducts = require('./getProducts')

module.exports = (query, opts) =>
  getProducts(objectAssign({query}, opts))
