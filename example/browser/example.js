/* eslint-env browser */
/* eslint-disable no-var, prefer-arrow-callback, id-length */
(function () {
  var vmp = window.Vinmonopolet
  var Mustache = window.Mustache
  var Paginator = window.Paginator

  var els = {
    products: document.getElementById('products'),
    categories: document.getElementById('categories'),
    pagination: document.getElementsByClassName('pagination')
  }

  var state = {page: 1, facet: window.location.hash.substr(1)}

  var tmpls = {
    product: [
      '<tr>',
      '<td><img src="{{img}}" /></td>',
      '<td><a href="{{url}}">{{name}}</a></td>',
      '<td>{{price}}</td>',
      '<td>{{productType}}</td>',
      '</tr>'
    ].join('\n'),

    category: [
      '<li class="{{className}}"><a href="#{{query}}">{{name}} ({{count}})</a></li>'
    ].join('\n')
  }

  // Cache templates
  Mustache.parse(tmpls.product)
  Mustache.parse(tmpls.categories)

  function renderCategories() {
    els.categories.innerHTML = state.categoryFacet.values.reduce(function (rows, value) {
      return rows + Mustache.render(tmpls.category, {
        name: value.name,
        count: value.count,
        query: value.query,
        className: value.query === state.facet ? 'active' : ''
      })
    }, '<li class="clear"><a href="#">✘ Clear</a></li>')
  }

  function renderProducts() {
    els.products.innerHTML = state.products.reduce(function (rows, product) {
      return rows + Mustache.render(tmpls.product, {
        img: getThumb(product.images).url,
        name: product.name,
        url: product.url,
        price: product.price.toFixed(2),
        productType: product.productType
      })
    }, '')
  }

  function renderPagination() {
    var pag = state.pagination
    var pg = new Paginator()
    pg.setTotalItems(pag.totalResults)
    pg.setItemsPerPage(pag.pageSize)
    pg.setCurrentPage(pag.currentPage + 1)

    for (var p = 0; p < els.pagination.length; p++) {
      var el = els.pagination[p]
      el.innerHTML = pg.render()

      var links = el.querySelectorAll('a')
      for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function (ev) {
          ev.preventDefault()
          state.page = Number(this.getAttribute('href').replace(/.*?page=(\d+)/, '$1'))
          fetchProducts()
          window.scrollTo(0, 0)
        }, false)
      }
    }
  }

  function clearProducts() {
    for (var p = 0; p < els.pagination.length; p++) {
      els.pagination[p].innerHTML = ''
    }

    els.products.innerHTML = ''
  }

  function fetchProducts() {
    clearProducts()

    var opts = {limit: 50, page: state.page}
    if (state.facet) {
      opts.facet = state.facet
    }

    vmp.getProducts(opts).then(function (result) {
      state.products = result.products
      state.pagination = result.pagination
      renderProducts()
      renderPagination()
    })
  }

  function getThumb(images) {
    for (var i = 0; i < images.length; i++) {
      if (images[i].format === 'thumbnail') {
        return images[i]
      }
    }

    return images[0]
  }

  function fetchFacets() {
    vmp.getFacets().then(function (facets) {
      var facet = null
      for (var i = 0; i < facets.length; i++) {
        if (facets[i].name === 'mainCategory') {
          facet = facets[i]
          break
        }
      }

      state.categoryFacet = facet
      renderCategories()
    })
  }

  function bindHashChange() {
    window.addEventListener('hashchange', function () {
      state.facet = window.location.hash.substr(1)
      renderCategories()
      fetchProducts()
    }, false)
  }

  bindHashChange()
  fetchProducts()
  fetchFacets()
})()
