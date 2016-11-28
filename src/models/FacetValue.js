const identity = val => val

const baseQuery = ':relevance:visibleInSearch:true:'
const reduceQuery = (query = '') => {
  return query.indexOf(baseQuery) === 0
    ? query.substr(baseQuery.length)
    : query
}

function FacetValue(value, filter = identity) {
  this.name = filter(value.name)
  this.count = value.count
  this.query = reduceQuery(value.query && value.query.query.value)
}

FacetValue.cooerce = facetVal => {
  if (facetVal instanceof FacetValue) {
    return facetVal
  }

  const val = String(facetVal)
  if (!/^\w+:.+/i.test(val)) {
    throw new Error('Facet value string must be in <facet>:<value> format')
  }

  return new FacetValue({query: {query: {value: val}}})
}

module.exports = FacetValue
