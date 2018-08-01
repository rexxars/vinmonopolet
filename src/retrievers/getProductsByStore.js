const objectAssign = require('object-assign')
const getProducts = require('./getProducts')

function getProductsByStore(store, opts) {
  const id = typeof store.name === 'undefined' ? store : store.name
  const facet = `availableInStores:${id}`
  const options = objectAssign({}, opts || {})

  let facets = [facet]
  if (options.facet || options.facets) {
    facets = facets.concat(options.facet || options.facets)
  }
  delete options.facet
  options.facets = facets

  return getProducts(options)
}
module.exports = getProductsByStore
