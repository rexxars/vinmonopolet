const Product = require('../models/Product')
const Pagination = require('../models/Pagination')
const request = require('../util/request')
const arrayify = require('../util/arrayify')
const oneOfMessage = require('../util/oneOfMessage')

const defaultQuery = ':'
const defaults = {limit: 50, page: 1}
const sortFields = ['relevance', 'name', 'price']
const sortOrders = ['asc', 'desc']
const sortTakesOrder = ['relevance']

function getProducts(opts) {
  const options = Object.assign({}, defaults, opts || {})
  const query = {
    pageSize: options.limit,
    currentPage: Math.max(0, options.page - 1),
    fields: 'FULL',
  }

  const sort = getSortParam(options.sort)
  if (sort) {
    query.sort = sort
  }

  if (opts.query) {
    query.query = opts.query
  }

  if (opts.facets) {
    const facets = arrayify(opts.facet || opts.facets)
    const existingQuery = (query.query || defaultQuery).split(':')

    query.query = existingQuery
      .concat(facets.map(val => val.query))
      .join(':')
  }

  return request('/products/search', {query})
    .then(res => ({
      products: (res.products || []).map(i => new Product(i)),
      pagination: new Pagination(res.pagination, options, getProducts)
    }))
    .then(res => {
      return opts.pagination ? res : res.products
    })
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

  const takesOrder = sortTakesOrder.indexOf(sortOrder) !== -1
  let newSortOrder = sortOrder
  if (!sortOrder && takesOrder) {
    newSortOrder = sortOrder[0]
  } else if (sortOrder && !takesOrder) {
    newSortOrder = undefined
  }

  return [sortField, newSortOrder].filter(Boolean).join('-')
}

module.exports = getProducts
