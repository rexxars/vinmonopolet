const request = require('../util/request')
const Facet = require('../models/Facet')

function getFacets(opts) {
  return request.get('/vmp/search/facets', {
    baseUrl: 'https://www.vinmonopolet.no',
    query: {
      // 500 thrown if no "q" parameter supplied.
      q: ''
    }
  })
    .then(res => res.facets.map(i => new Facet(i)))
}

module.exports = getFacets
