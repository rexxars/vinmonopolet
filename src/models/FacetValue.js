const identity = val => val

const baseQuery = ':relevance:visibleInSearch:true:'
const reduceQuery = (query = '') => {
  return query.indexOf(baseQuery) === 0
    ? query.substr(baseQuery.length)
    : query
}

module.exports = function FacetValue(value, filter = identity) {
  this.name = filter(value.name)
  this.count = value.count
  this.query = reduceQuery(value.query && value.query.query.value)
}
