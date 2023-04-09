const request = require('../util/request')
const Facet = require('../models/Facet')

function getFacets(opts) {
  return request.get('/api/search', {
    baseUrl: 'https://www.vinmonopolet.no',
    query: {
      fields: 'FULL'
    }
  })
    .then(res => res.productSearchResult.facets.map(i => new Facet(i)))
}

module.exports = getFacets
