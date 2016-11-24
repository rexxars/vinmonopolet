const ProductStatus = require('../models/ProductStatus')
const map = {
  aktiv: ProductStatus.ACTIVE,
  utsolgt: ProductStatus.OUT_OF_STOCK,
  utgatt: ProductStatus.EXPIRED
}

module.exports = function statusFilter(val) {
  return map[val]
}
