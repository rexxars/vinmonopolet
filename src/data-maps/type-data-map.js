'use strict';

var numberFilter = require('../filters/number');
var trimFilter = require('../filters/trim');

module.exports = {
    title: {
        filter: trimFilter
    },

    productCount: {
        filter: numberFilter.greedy
    },

    filterId: {
        filter: numberFilter
    }
};
