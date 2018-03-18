/* eslint-disable max-nested-callbacks */
const mocha = require('mocha')
const unpipe = require('unpipe')
const expect = require('chai').expect
const promiseProps = require('promise-props')
const {transform, countBy} = require('lodash')
const vinmonopolet = require('../src/index')
const filters = require('../src/filters')
const request = require('../src/util/request')
const productUrl = require('../src/util/productUrl')
const streamMethods = require('../src/stream')
const noBrowser = require('../src/no-browser')
require('hard-rejection/register')

/* Don't depend on mocha globals */
const describe = mocha.describe
const it = mocha.it

/* Helper functions */
const first = res => res.products[0]
const productsOnly = res => res.products

const getProductCode = () => vinmonopolet
  .getProducts({sort: ['price', 'desc'], limit: 1})
  .then(first)
  .then(res => res.code)

const dupes = array =>
  transform(countBy(array), (result, count, value) => {
    if (count > 1) {
      result.push(value)
    }
  }, [])

/* Tests */
describe('vinmonopolet', function () {
  this.timeout(20000)

  describe('getProducts', () => {
    it('can get basic product listing, returns promise', () =>
      expect(vinmonopolet.getProducts().then(productsOnly))
        .to.eventually.have.length.above(0)
    )

    it('returns array of Product instances', () =>
      vinmonopolet.getProducts().then(productsOnly).then(products => {
        products.forEach(prod => expect(prod).to.be.an.instanceOf(vinmonopolet.Product))
      })
    )

    it('can apply a limit', () =>
      expect(vinmonopolet.getProducts({limit: 1}).then(productsOnly))
        .to.eventually.have.lengthOf(1)
    )

    it('can apply an offset (page number)', () => Promise.all([
      vinmonopolet.getProducts({limit: 1}).then(first),
      vinmonopolet.getProducts({limit: 1, page: 2}).then(first)
    ]).then(res => {
      expect(res[0].code).to.not.equal(res[1].code, 'products are not the same when applying page')
    }))

    it('can apply sorting by relevance (as a string)', () =>
      expect(vinmonopolet.getProducts({sort: 'relevance', limit: 1}).then(productsOnly))
        .to.eventually.have.length.above(0)
    )

    it('can apply sorting by name (as a string)', () => Promise.all([
      vinmonopolet.getProducts({limit: 1, sort: 'relevance'}).then(first),
      vinmonopolet.getProducts({limit: 1, sort: 'name'}).then(first)
    ]).then(res => {
      expect(res[0].code).to.not.equal(res[1].code, 'products are not the same when applying different sorts')
    }))

    it('can apply sorting by price (as a string)', () => Promise.all([
      vinmonopolet.getProducts({limit: 1, sort: 'name'}).then(first),
      vinmonopolet.getProducts({limit: 1, sort: 'price'}).then(first)
    ]).then(res => {
      expect(res[0].code).to.not.equal(res[1].code, 'products are not the same when applying different sorts')
    }))

    it('can apply sorting by price (ascending/descending)', () => Promise.all([
      vinmonopolet.getProducts({limit: 1, sort: ['price', 'asc']}).then(first),
      vinmonopolet.getProducts({limit: 1, sort: ['price', 'desc']}).then(first)
    ]).then(res => {
      expect(res[0].price).to.be.below(res[1].price, 'products are not the same when applying different sorts')
    }))

    it('can apply sorting by name (ascending/descending)', () => Promise.all([
      vinmonopolet.getProducts({limit: 1, sort: ['name', 'asc']}).then(first),
      vinmonopolet.getProducts({limit: 1, sort: ['name', 'desc']}).then(first)
    ]).then(res => expect(res[0].name.charCodeAt(0))
      .to.be.below(res[1].name.charCodeAt(0),
      'products are not the same when applying different sorts')
    ))

    it('applying sort order to relevance makes no difference', () => Promise.all([
      vinmonopolet.getProducts({limit: 1, sort: ['relevance', 'asc']}).then(first),
      vinmonopolet.getProducts({limit: 1, sort: ['relevance', 'desc']}).then(first)
    ]).then(res => expect(res[0].code).to.equal(res[1].code)))

    it('throws if trying to sort on unknown field', () => {
      expect(() => {
        vinmonopolet.getProducts({sort: 'foo'})
      }).to.throw(/not valid.*?relevance/)
    })

    it('throws if trying to sort in unknown order', () => {
      expect(() => {
        vinmonopolet.getProducts({sort: ['price', 'bar']})
      }).to.throw(/not valid.*?asc/)
    })

    it('can apply facet to limit result scope', () =>
      vinmonopolet.getProducts({facet: vinmonopolet.Facet.Category.MEAD})
        .then(productsOnly)
        .then(res => res.forEach(prod => expect(prod.productType).to.equal('Mjød')))
    )

    it('can apply facets to limit result scope', () =>
      vinmonopolet.getProducts({facets: [vinmonopolet.Facet.Category.BEER, 'mainCountry:norge']})
        .then(productsOnly)
        .then(res => res.forEach(prod => expect(prod.productType).to.equal('Øl')))
    )

    it('throws if trying to apply invalid facet value', () => {
      expect(() => {
        vinmonopolet.getProducts({facet: 'fooBar'})
      }).to.throw(/<facet>:<value>/)
    })

    it('accepts cooercion of valid facet values', () => {
      expect(() => {
        vinmonopolet.getProducts({facet: 'mainCategory:rødvin'})
      }).to.not.throw()
    })

    it('can apply a freetext query', () =>
      vinmonopolet.getProducts({query: 'valpolicella', limit: 3}).then(productsOnly).then(res => {
        expect(res).to.have.length.above(0)
        res.forEach(prod => expect(prod.name.toLowerCase()).to.include('valpolicella'))
      })
    )

    it('returns empty array if no results are found', () =>
      vinmonopolet.getProducts({query: `nonexistant${Date.now()}`}).then(productsOnly).then(res => {
        expect(res).to.have.lengthOf(0)
      })
    )

    it('returns pagination info', () =>
      vinmonopolet.getProducts({limit: 1, sort: ['name', 'asc']}).then(res => {
        expect(res.products).to.be.an('array').and.have.lengthOf(1)
        expect(res.pagination).to.be.an.instanceOf(vinmonopolet.Pagination)
        expect(res.pagination).to.have.property('currentPage', 0)
        expect(res.pagination).to.have.property('pageSize', 1)
        expect(res.pagination).to.have.property('hasNext', true)
        expect(res.pagination).to.have.property('hasPrevious', false)
        expect(res.pagination).to.have.property('sort', 'name-asc')
        expect(res.pagination.totalPages).to.be.a('number').and.be.above(10)
        expect(res.pagination.totalResults).to.be.a('number').and.be.above(100)
      })
    )

    it('can use the pagination info to traverse next/previous page', () => {
      const chunks = []
      const getNext = res => {
        chunks.push(res.products[0])
        return res.pagination.next()
      }

      const getPrev = res => {
        chunks.push(res.products[0])
        return res.pagination.previous()
      }

      const assertLast = res => {
        const productNames = chunks.map(prod => prod.name)
        expect(dupes(productNames)).to.have.lengthOf(0, 'should not have any duplicates when paginating')
        expect(res.products[0].name).to.equal(chunks[2].name, 'prev should go back to previous page')
      }

      return vinmonopolet.getProducts({limit: 1})
        .then(getNext)
        .then(getNext)
        .then(getNext)
        .then(getPrev)
        .then(assertLast)
    })

    it('can can check if a product is "completely" populated', () =>
      vinmonopolet.getProducts({query: 'valpolicella', limit: 1})
        .then(first)
        .then(prod => expect(prod.isComplete()).to.equal(false))
    )

    it('can populate product instances with more detailed info', () =>
      vinmonopolet.getProducts({query: 'valpolicella', limit: 1})
        .then(first)
        .then(prod => prod.populate())
        .then(prod => {
          expect(prod).to.have.property('ageLimit').and.be.above(17)
          expect(prod.isComplete()).to.equal(true)
        })
    )

    it('calling populate() on already populated instances still resolves', () =>
      vinmonopolet.getProducts({query: 'valpolicella', limit: 1})
        .then(first)
        .then(prod => prod.populate())
        .then(prod => prod.populate())
        .then(prod => {
          expect(prod).to.have.property('ageLimit').and.be.above(17)
        })
    )
  })

  describe('getProducts.count', () => {
    it('can get total count for a regular query', () =>
      expect(vinmonopolet.getProducts.count({sort: 'name'}))
        .to.eventually.be.a('number').and.be.above(0)
    )

    it('can get total count regardless of options', () =>
      expect(vinmonopolet.getProducts.count({
        sort: ['name', 'desc'],
        query: 'valpolicella',
        limit: 10,
        page: 2,
        facets: [vinmonopolet.Facet.Category.RED_WINE]
      })).to.eventually.be.a('number').and.be.above(0)
    )
  })

  describe('getFacets', () => {
    it('can get facets list, returns promise of array', () =>
      expect(vinmonopolet.getFacets())
        .to.eventually.have.length.above(0)
    )

    it('cooerces to Facet instances', () =>
      vinmonopolet.getFacets().then(facets => {
        facets.forEach(facet => expect(facet).to.be.an.instanceOf(vinmonopolet.Facet))
      })
    )

    it('populates facets with title, name, category and values', () =>
      vinmonopolet.getFacets().then(facets => {
        facets.forEach(facet => {
          expect(facet).to.have.property('title')
          expect(facet).to.have.property('name')
          expect(facet).to.have.property('category')
          expect(facet).to.have.property('values').and.be.an('array')

          facet.values.forEach(val => expect(val).to.be.an.instanceOf(vinmonopolet.FacetValue))
        })
      })
    )

    it('can use returned facets to search for products', () =>
      vinmonopolet.getFacets().then(facets => {
        const countryFacet = facets.find(facet => facet.title === 'mainCountry')
        expect(countryFacet).to.be.an.instanceOf(vinmonopolet.Facet)

        const norwayFacetValue = countryFacet.values.find(val => val.name === 'Norge')
        expect(norwayFacetValue).to.be.an.instanceOf(vinmonopolet.FacetValue)

        return vinmonopolet.getProducts({limit: 3, facet: norwayFacetValue})
      }).then(res => {
        res.products.forEach(prod => expect(prod).to.have.deep.property('mainCountry.name', 'Norge'))
      })
    )
  })

  describe('searchProducts', () => {
    it('takes the same options as getProducts', () =>
      vinmonopolet.searchProducts('valpolicella', {
        limit: 3,
        sort: ['price', 'asc']
      }).then(res => {
        res.products.reduce((prevPrice, prod) => {
          expect(prod.price).to.be.above(prevPrice)
          expect(prod.name.toLowerCase()).to.include('valpolicella')
          return prod.price
        }, 0)
      })
    )
  })

  describe('getProduct', () => {
    it('fetches the given product', () =>
      expect(vinmonopolet.getProduct('gavekort'))
        .to.eventually.be.an.instanceOf(vinmonopolet.Product)
        .and.include.keys({
          code: 'gavekort',
          name: 'Gavekort'
        })
    )

    it('populates with food pairings that can be stringified', () => getProductCode()
      .then(vinmonopolet.getProduct)
      .then(product => {
        product.foodPairing.forEach(food => {
          expect(food).to.be.an.instanceOf(vinmonopolet.FoodPairing)
          expect(food.toString()).to.be.a('string').and.have.length.above(0)
        })
      })
    )

    it('populates with raw materials that can be stringified', () => getProductCode()
      .then(vinmonopolet.getProduct)
      .then(product => {
        product.rawMaterial.forEach(raw => {
          expect(raw).to.be.an.instanceOf(vinmonopolet.RawMaterial)
          expect(raw.toString()).to.be.a('string').and.have.length.above(0)
        })
      })
    )

    it('populates with product images that can be stringified', () => getProductCode()
      .then(vinmonopolet.getProduct)
      .then(product => {
        product.images.forEach(img => {
          expect(img).to.be.an.instanceOf(vinmonopolet.ProductImage)
          expect(img.toString()).to.match(/^https?:\/\//)
        })
      })
    )
  })

  describe('getProductsById', () => {
    it('fetches products by id', () =>
      vinmonopolet.getProducts({query: 'valpolicella', limit: 3})
        .then(res => res.products.map(prod => prod.code))
        .then(ids => vinmonopolet.getProductsById(ids))
        .then(prods => prods.forEach(prod => {
          expect(prod.name.toLowerCase()).to.contain('valpolicella')
        }))
    )
  })

  describe('getProductByBarcode', () => {
    it('fetches products by barcode', () =>
      vinmonopolet.getProducts({limit: 5, facets: [vinmonopolet.Facet.Category.BEER, 'mainCountry:norge']})
        .then(productsOnly)
        .then(products => Promise.all(products.map(product => product.populate())))
        .then(products => products.find(prod => prod.barcode))
        .then(product => promiseProps({
          targetProduct: product,
          foundProduct: vinmonopolet.getProductByBarcode(product.barcode)
        }))
        .then(products => {
          expect(products.foundProduct).to.be.an.instanceOf(vinmonopolet.Product)
          expect(products.foundProduct.code).to.equal(products.targetProduct.code)
        })
    )
  })

  describe('stream.getProducts', () => {
    it('returns a stream of products', done => {
      const stream = vinmonopolet.stream.getProducts()
      let numProducts = 0
      const onProduct = prod => {
        if (++numProducts === 10) {
          stream.removeListener('data', onProduct)
          unpipe(stream)
          stream.destroy()
          done()
          return
        }

        expect(prod).to.be.an.instanceOf(vinmonopolet.Product)
        expect(prod.code).to.be.a('string').and.have.length.above(0)
        expect(prod.isComplete()).to.equal(false, 'should not say stream products are complete')
      }

      stream.on('data', onProduct)
    })

    it('can stream the entire set of data without crashing', done => {
      vinmonopolet.stream.getProducts()
        .on('data', prod => {
          expect(prod).to.be.an.instanceOf(vinmonopolet.Product)
          expect(prod.code).to.be.a('string').and.have.length.above(0)
          expect(prod.isComplete()).to.equal(false, 'should not say stream products are complete')
        })
        .on('end', done)
    })
  })

  describe('stream.getStores', () => {
    it('returns a stream of stores', done => {
      const stream = vinmonopolet.stream.getStores()
      let numStores = 0
      const onStore = prod => {
        if (++numStores === 10) {
          stream.removeListener('data', onStore)
          unpipe(stream)
          stream.destroy()
          done()
          return
        }

        expect(prod).to.be.an.instanceOf(vinmonopolet.Store)
        expect(prod.name).to.be.a('string').and.have.length.above(0)
      }

      stream.on('data', onStore)
    })

    it('can stream the entire set of data without crashing', done => {
      vinmonopolet.stream.getStores()
        .on('data', prod => {
          expect(prod).to.be.an.instanceOf(vinmonopolet.Store)
          expect(prod.name).to.be.a('string').and.have.length.above(0)
        })
        .on('end', done)
    })
  })

  describe('edge-cases', () => {
    it('handles dirty data in filters', () => {
      expect(filters.foodPairing()).to.be.an('array').and.have.lengthOf(0)
      expect(filters.foodPairing(null)).to.be.an('array').and.have.lengthOf(0)

      expect(filters.number.greedy('')).to.be.a('null')

      expect(filters.openingHours('stengt')).to.be.a('null')
      expect(filters.openingHours('Stengt')).to.be.a('null')

      expect(filters.price(null)).to.be.a('null')

      expect(filters.volume(null)).to.be.a('null')
      expect(filters.volume(0.75)).to.equal(0.75)

      expect(productUrl('1234')).to.equal('https://www.vinmonopolet.no/p/1234')
    })

    it('can perform raw requests, returning plain body', () =>
      expect(request.raw('https://www.vinmonopolet.no/')).to.eventually.contain('<title>')
    )
  })

  describe('http requests', () => {
    it.skip('handles errors gracefully', () =>
      expect(request.get('/products/search?fields=moo'))
        .to.eventually.be.rejectedWith(/HTTP 400 Bad Request[\s\S]*Incorrect field:'moo'/)
    )

    it('can perform raw requests, returning plain body', () =>
      expect(request.raw('https://www.vinmonopolet.no/')).to.eventually.contain('<title>')
    )
  })

  describe('browser build', () => {
    it('throws if trying to use any of the stream methods', () => {
      Object.keys(streamMethods).forEach(method => {
        expect(noBrowser[method]).to.be.a('function')
        expect(noBrowser[method]).to.throw(/not supported in browser/)
      })
    })
  })
})
