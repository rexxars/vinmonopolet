/* eslint-disable max-statements */
const productMap = require('../datamaps/productMap')
const streamMap = require('../datamaps/productStreamMap')
const camelcase = require('lodash.camelcase')

function Product(product) {
  // Core product info
  this.code = product.code
  this.name = product.name
  this.productType = (product.main_category && product.main_category.name) || null
  this.abv = null
  this.url = null
  this.price = null
  this.pricePerLiter = null
  this.images = null
  this.barcode = null
  this.containerSize = null
  this.containerType = null
  this.vintage = null
  this.cork = null

  // These tend to not be set
  this.description = null
  this.summary = null
  this.method = null

  // Scales
  this.tannins = null
  this.fullness = null
  this.sweetness = null
  this.freshness = null
  this.bitterness = null

  // Tasting notes/content
  this.color = null
  this.aroma = null
  this.taste = null
  this.matured = null
  this.foodPairing = null
  this.rawMaterial = null
  this.sugar = null
  this.acid = null

  // Boolean flags
  this.eco = null
  this.gluten = null
  this.kosher = null
  this.fairTrade = null
  this.bioDynamic = null

  // Producer/distributer/importer etc
  this.mainProducer = null
  this.distributor = null
  this.distributorId = null
  this.wholesaler = null

  // Classification
  this.categories = null
  this.storeCategory = null
  this.mainCategory = null
  this.mainSubCategory = null
  this.mainCountry = null
  this.district = null
  this.subDistrict = null
  this.productSelection = null

  // Meta
  this.buyable = null
  this.deliveryTime = null
  this.nrOfUsage = null
  this.availableForPickup = null
  this.averageRating = null

  // Stock/store-related
  this.stock = null
  this.status = null
  this.ageLimit = null
  this.expiredDate = null
  this.purchasable = null
  this.newProduct = null

  Object.keys(product).forEach(key => {
    const [name, valueFilter] = productMap[key] || []
    const fieldName = name || camelcase(key)
    this[fieldName] = valueFilter ? valueFilter(product[key]) : product[key]
  })
}

Product.fromStream = function (product) {
  const prod = new Product({})
  Object.keys(product).forEach(key => {
    const [name, ...filters] = streamMap[key] || []
    if (!name) {
      return
    }

    let value = product[key]
    if (filters.length) {
      filters.forEach(filter => {
        value = filter(value, product)
      })
    }

    prod[name] = value
  })

  return prod
}

Product.prototype.isComplete = function () {
  return typeof this.numberOfReviews !== 'undefined'
}

Product.prototype.populate = function () {
  if (this.isComplete()) {
    return Promise.resolve(this)
  }

  // Lazy require here because of circular dependencies
  const getProduct = require('../retrievers/getProduct')
  return getProduct(this.code)
}

module.exports = Product
