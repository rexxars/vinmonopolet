'use strict';

var dataMap = require('../data-maps/product-data-map');
var setProps = require('./set-props');
var productBaseUrl = 'http://www.vinmonopolet.no/vareutvalg/varedetaljer/sku-';

module.exports = function Product(row, map) {
    setProps(this, row, map || dataMap);

    if (!this.url && this.sku) {
        this.url = productBaseUrl + this.sku;
    }
};
