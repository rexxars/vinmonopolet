/* eslint-disable */
window.Paginator = (function () {

  var p = function () { /* noop */ }

  /**
   * Sets the total number of items in the dataset
   */
  p.prototype.setTotalItems = function (num) {
    this.totalItems = num
    return this
  }

  /**
   * Returns the total number of items (or 0 if not defined)
   */
  p.prototype.getTotalItems = function () {
    return this.totalItems || 0
  }

  /**
   * Sets the number of items per page
   */
  p.prototype.setItemsPerPage = function (num) {
    this.itemsPerPage = num
    return this
  }

  /**
   * Returns the number of items per page
   * Defaults to 10.
   */
  p.prototype.getItemsPerPage = function () {
    return this.itemsPerPage || 10
  }

  /**
   * Sets an array to use as the dataset, for use with getItemsByPage() etc
   */
  p.prototype.setData = function (data) {
    this.data = data
    this.setTotalItems(data.length)
    return this
  }

  /**
   * Sets the current page number
   */
  p.prototype.setCurrentPage = function (num) {
    this.currentPage = this.normalize(num)
    return this
  }

  /**
   * Returns the total number of pages
   */
  p.prototype.getNumberOfPages = function () {
    return Math.ceil(this.getTotalItems() / this.getItemsPerPage())
  }

  /**
   * Normalizes page number by making sure it is within the range of the paginator
   */
  p.prototype.normalize = function (val) {
    var num = Math.max(parseInt(val, 10), 1)

    var pages = this.getNumberOfPages()
    if (pages > 0 && num > pages) {
      num = pages
    }

    return num
  }

  /**
   * Returns the given page of the dataset, or false if no data has been set
   */
  p.prototype.getItemsByPage = function (val) {
    var page = this.normalize(val)

    var offset = (page - 1) * this.getItemsPerPage()
    return this.data ? this.data.slice(offset, this.getItemsPerPage()) : false
  }

  /**
   * Returns the current page of the dataset, or false if no data has been set
   */
  p.prototype.getCurrentItems = function () {
    return this.getItemsByPage(this.currentPage || 1)
  }

  /**
   * Sets page range (number of pages to show in pagination control)
   */
  p.prototype.setPageRange = function (num) {
    this.pageRange = num
    return this
  }

  /**
   * Returns the set page range (number of pages to show in pagination control)
   * Defaults to 10.
   */
  p.prototype.getPageRange = function () {
    return this.pageRange || 10
  }

  /**
   * Creates an array containing the page numbers within the current range
   */
  p.prototype.getPagesInRange = function () {
    var pageRange = this.getPageRange()

    var pageNumber = this.currentPage || 1
    var pageCount = this.getNumberOfPages()

    if (pageRange > pageCount) {
      pageRange = pageCount
    }

    var delta = Math.ceil(pageRange / 2)
    var lowerBound
    var upperBound

    if (pageNumber - delta > pageCount - pageRange) {
      lowerBound = pageCount - pageRange + 1
      upperBound = pageCount
    } else {
      if (pageNumber - delta < 0) {
        delta = pageNumber
      }

      var offset = pageNumber - delta
      lowerBound = offset + 1
      upperBound = offset + pageRange
    }

    lowerBound = this.normalize(lowerBound)
    upperBound = this.normalize(upperBound)

    var pages = []
    for (pageNumber = lowerBound; pageNumber <= upperBound; pageNumber++) {
      pages.push(pageNumber)
    }
    return pages
  }

  /**
   * Creates an object containing all the information needed to build a pagination control
   */
  p.prototype.getInfo = function () {
    var pageCount = this.getNumberOfPages()
    var current = this.currentPage || 1

    var info = {
      pageCount: pageCount,
      itemsPerPage: this.getItemsPerPage(),
      totalItems: this.getTotalItems(),
      current: current,
      first: 1,
      last: pageCount,
    }

    // Previous and next
    if (current - 1 > 0) {
      info.previous = current - 1
    }

    if (current + 1 <= pageCount) {
      info.next = current + 1
    }

    // Pages in range
    info.pagesInRange = this.getPagesInRange()
    info.firstPageInRange = Math.min.apply(Math, info.pagesInRange)
    info.lastPageInRange = Math.max.apply(Math, info.pagesInRange)

    return info
  }

  /**
   * Build a URL based on the passed page and URL template
   *
   * Allowed template variables:
   *   {page}   - Replaced with the page number passed
   *   {limit}  - Replaced with the number of items per page
   *   {offset} - Replaced with the calculated offset for passed page number
   */
  p.prototype.getUrl = function (pageNum, url) {
    var page = this.normalize(pageNum)
    var offset = (page - 1) * this.getItemsPerPage()
    var limit = this.getItemsPerPage()
    return (url || '?page={page}').replace(/\{page\}/g, page).replace(/\{offset\}/g, offset).replace(/\{limit\}/g, limit)
  }

  /**
   * Creates HTML markup for a pagination control
   */
  p.prototype.render = function (options) {
    var pages = this.getInfo()
    var o = options || {}
    if (pages.pageCount <= 1) {
      return ''
    }

    var html = ['<ul class="' + (o.paginatorClass || 'paginator') + '">']

    if (pages.previous) {
      // "First"-link
      html.push(
        '<li class="', (o.firstClass || 'first'), '">',
        '<a href="', this.getUrl(pages.first, o.url), '">', (o.firstText || '«'), '</a>',
        '</li>'
      )

      // "Previous"-link
      html.push(
        '<li class="', (o.prevClass || 'previous'), '">',
        '<a href="', this.getUrl(pages.previous, o.url), '">', (o.prevText || '&larr;'), '</a>',
        '</li>'
      )
    }

    var page
    var active
    var i = 0
    for (i = 0; i < pages.pagesInRange.length; i++) {
      page = pages.pagesInRange[i]
      active = (pages.current == page) ? ' class="' + (o.activeClass || 'active') + '"' : ''
      html.push('<li', active, '><a href="', this.getUrl(page, o.url), '">', page, '</a></li>')
    }

    if (pages.next) {
      // "Next"-link
      html.push(
        '<li class="', (o.nextClass || 'next'), '">',
        '<a href="', this.getUrl(pages.next, o.url), '">', (o.prevText || '&rarr;'), '</a>',
        '</li>'
      )

      // "Last"-link
      html.push(
        '<li class="', (o.lastClass || 'last'), '">',
        '<a href="', this.getUrl(pages.last, o.url), '">', (o.lastText || '»'), '</a>',
        '</li>'
      )
    }
    html.push('</ul>')

    return html.join('')
  }

  return p

})()
