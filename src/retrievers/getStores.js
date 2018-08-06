const objectAssign = require('object-assign')
const Store = require('../models/Store')
const Pagination = require('../models/Pagination')
const request = require('../util/request')

const defaults = {page: 1}

function getStores(opts) {
  const options = objectAssign({}, defaults, opts || {})
  const query = {
    q: '*',
    page: Math.max(0, options.page - 1)
  }

  const {lat, lon} = options.nearLocation || {}
  if (lat && lon) {
    query.latitude = lat
    query.longitude = lon
  }

  if (options.query) {
    query.q = options.query
  }

  const req = request.get('/vmp/store-finder', {
    baseUrl: 'https://www.vinmonopolet.no',
    query
  })

  return req.then(res => ({
    stores: (res.data || []).map(i => new Store(i)),
    pagination: new Pagination(getPagination(query.page, res), options, getStores)
  }))
}

function getPagination(currentPage, res) {
  const pageSize = 10 // Hard coded in the API

  return {
    currentPage,
    pageSize,
    totalPages: Math.ceil(res.total / pageSize),
    totalResults: res.total
  }
}

module.exports = getStores
