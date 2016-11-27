const Product = require('../models/Product')
const request = require('../util/request')

function getProduct(code) {
  const query = {fields: 'FULL'}
  return request.get(`/products/${code}`, {query})
    .then(product => new Product(product))
}

module.exports = getProduct
