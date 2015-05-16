'use strict';

var trimFilter = require('../filters/trim');

module.exports = function(value) {
    var productInfo = {};
    var parts = value.split(',').map(trimFilter).filter(Boolean);

    if (parts.length) {
        productInfo.Land = parts.shift();
    }

    if (parts.length) {
        productInfo.Distrikt = parts.shift();
    }

    if (parts.length) {
        productInfo.Underdistrikt = parts.join(', ');
    }

    return productInfo;
};
