const request = require('../util/request')
const Facet = require('../models/Facet')

function getFacets(opts) {
  const query = {fields: 'facets'}
  return request.get('/products/search', {query})
    .then(res => res.facets.map(i => new Facet(i)))
}

module.exports = getFacets
