const through = require('through2')
const iconv = require('iconv-lite')
const split = require('split')
const csv = require('csv-parser')
const request = require('request')
const csvUrls = require('./csvUrls')
const Product = require('./models/Product')
const Store = require('./models/Store')
const symmetricStream = require('./util/symmetric-stream')

const csvOptions = {separator: ';'}

function getCsvStream(url, transformer) {
  return request(url)
    .pipe(iconv.decodeStream('iso-8859-1'))
    .pipe(split())
    .pipe(symmetricStream())
    .pipe(csv(csvOptions))
    .pipe(through.obj(transformer))
}

function transformProduct(prod, enc, cb) {
  this.push(Product.fromStream(prod))
  cb()
}

function transformStore(store, enc, cb) {
  this.push(new Store(store))
  cb()
}

module.exports = {
  getProducts() {
    return getCsvStream(csvUrls.products, transformProduct)
  },

  getStores() {
    return getCsvStream(csvUrls.stores, transformStore)
  }
}
