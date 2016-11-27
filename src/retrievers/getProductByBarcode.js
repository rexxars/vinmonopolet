const Product = require('../models/Product')
const request = require('../util/request')

function getProductByBarcode(barcode) {
  const query = {fields: 'FULL'}
  return request.get(`/products/barCodeSearch/${barcode}`, {query})
    .then(product => new Product(product))
}

module.exports = getProductByBarcode
