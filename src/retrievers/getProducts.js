const objectAssign = require('object-assign')
const Product = require('../models/Product')
const Pagination = require('../models/Pagination')
const FacetValue = require('../models/FacetValue')
const request = require('../util/request')
const arrayify = require('../util/arrayify')
const oneOfMessage = require('../util/oneOfMessage')

const defaults = {limit: 50, page: 1}
const sortFields = ['relevance', 'name', 'price']
const sortOrders = ['asc', 'desc']
const sortTakesOrder = ['name', 'price']

function getProducts(opts) {
  const options = objectAssign({}, defaults, opts || {})
  const query = {
    pageSize: options.limit,
    currentPage: Math.max(0, options.page - 1),
    fields: 'FULL',
  }

  // The `query` query parameter (heh) has the following syntax (a bit weird, this);
  // freeTextSearch:sort:facetKey1:facetValue1:facetKey2:facetValue2
  const queryParts = {
    freeTextSearch: '',
    sort: 'relevance',
    facets: []
  }

  if (options.query) {
    queryParts.freeTextSearch = options.query
  }

  const sort = getSortParam(options.sort)
  if (sort) {
    queryParts.sort = sort
  }

  if (options.facet || options.facets) {
    const facets = arrayify(options.facet || options.facets)
    queryParts.facets = facets.map(FacetValue.cooerce).map(val => val.query)
  }

  // Serialize actual "query" query param as outlined above
  query.query = [queryParts.freeTextSearch, queryParts.sort]
    .concat(queryParts.facets)
    .join(':')

  const getter = request[options.onlyCount ? 'head' : 'get']
  const req = getter('/products/search', {query})

  if (options.onlyCount) {
    return req.then(res => Number(res.headers['x-total-count']))
  }

  return req.then(res => ({
    products: (res.products || []).map(i => new Product(i)),
    pagination: new Pagination(res.pagination, options, getProducts)
  }))
}

getProducts.count = opts => {
  return getProducts(objectAssign({}, opts, {onlyCount: true}))
}

function getSortParam(sort) {
  if (!sort) {
    return undefined
  }

  const [sortField, sortOrder] = arrayify(sort)

  if (sortFields.indexOf(sortField) === -1) {
    throw new Error(`"options.sort[0]" is not valid. ${oneOfMessage(sortFields)}`)
  }

  if (sortOrder && sortOrders.indexOf(sortOrder) === -1) {
    throw new Error(`"options.sort[1]" is not valid. ${oneOfMessage(sortOrders)}`)
  }

  const takesOrder = sortTakesOrder.indexOf(sortField) !== -1
  let newSortOrder = sortOrder
  if (!sortOrder && takesOrder) {
    newSortOrder = sortOrders[0]
  } else if (sortOrder && !takesOrder) {
    newSortOrder = undefined
  }

  return [sortField, newSortOrder].filter(Boolean).join('-')
}

module.exports = getProducts
