const objectAssign = require('object-assign')

function Pagination(paging, options, fetcher) {
  this.currentPage = paging.currentPage
  this.pageSize = paging.pageSize
  this.totalPages = paging.totalPages
  this.totalResults = paging.totalResults
  this.hasNext = paging.currentPage < this.totalPages
  this.hasPrevious = paging.currentPage > 0
  this.sort = paging.sort

  this.fetcher = fetcher
  this.options = options
}

Pagination.prototype.next = function () {
  return this.fetcher(
    objectAssign({}, this.options, {page: this.options.page + 1})
  )
}

Pagination.prototype.previous = function () {
  return this.fetcher(
    objectAssign({}, this.options, {page: Math.max(0, this.options.page - 1)})
  )
}

module.exports = Pagination
