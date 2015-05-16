'use strict';

var numberFilter = require('../filters/number');
var textFilter = require('../filters/text');

module.exports = {
    storeId: {
        filter: numberFilter
    },

    storeName: {
        filter: textFilter
    },

    quantity: {
        filter: numberFilter
    },

    productSku: {
        filter: numberFilter
    }
};
